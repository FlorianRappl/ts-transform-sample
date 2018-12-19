import * as ts from 'typescript';
import { createGenerateFunction, nameOfGenerateFunction } from './generate';
import { getDescriptor } from './descriptor';

export interface TransformerOptions {}

export function transformer(program: ts.Program, opts?: TransformerOptions) {
  function visitor(ctx: ts.TransformationContext, sf: ts.SourceFile, result: { seen: boolean }) {
    const typeChecker = program.getTypeChecker();

    const visitor: ts.Visitor = (node: ts.Node) => {
      if (ts.isCallExpression(node) && node.typeArguments && node.expression.getText(sf) == 'generateRtti') {
        const [type] = node.typeArguments;
        const [argument] = node.arguments;
        const fn = ts.createIdentifier(nameOfGenerateFunction);
        const typeName = type.getText();
        const typeSource = getDescriptor(type, typeChecker);
        result.seen = true;
        return ts.createCall(fn, undefined, [argument || ts.createStringLiteral(typeName), typeSource]);
      }

      return ts.visitEachChild(node, visitor, ctx);
    };

    return visitor;
  }

  return (ctx: ts.TransformationContext) => {
    return (sf: ts.SourceFile) => {
      const result = { seen: false };
      const newSf = ts.visitNode(sf, visitor(ctx, sf, result));

      if (result.seen) {
        const fn = createGenerateFunction();
        const statements: Array<ts.Statement> = [fn];

        for (const statement of newSf.statements) {
          if (ts.isImportDeclaration(statement)) {
            statements.splice(statements.length - 1, 0, statement);
          } else {
            statements.push(statement);
          }
        }

        return ts.updateSourceFileNode(newSf, statements);
      }

      return newSf;
    };
  };
}
