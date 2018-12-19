import * as ts from 'typescript';

const globalVariableName = '__rtti__types';

export const nameOfGenerateFunction = '__rtti__generate';

export function createGenerateFunction() {
  const contextVariableName = 'ctx';
  const localVariableName = 'types';
  const typeNameParameter = 'typeName';
  const typeDefParameter = 'typeDefinition';
  return ts.createFunctionDeclaration(
    undefined,
    undefined,
    undefined,
    nameOfGenerateFunction,
    undefined,
    [
      ts.createParameter(undefined, undefined, undefined, typeNameParameter),
      ts.createParameter(undefined, undefined, undefined, typeDefParameter),
    ],
    undefined,
    ts.createBlock([
      ts.createVariableStatement(undefined, [
        ts.createVariableDeclaration(
          contextVariableName,
          undefined,
          ts.createConditional(
            ts.createStrictEquality(
              ts.createTypeOf(ts.createIdentifier('window')),
              ts.createStringLiteral('undefined'),
            ),
            ts.createIdentifier('global'),
            ts.createIdentifier('window'),
          ),
        ),
      ]),
      ts.createVariableStatement(undefined, [
        ts.createVariableDeclaration(
          localVariableName,
          undefined,
          ts.createLogicalOr(
            ts.createPropertyAccess(ts.createIdentifier(contextVariableName), globalVariableName),
            ts.createAssignment(
              ts.createPropertyAccess(ts.createIdentifier(contextVariableName), globalVariableName),
              ts.createObjectLiteral(),
            ),
          ),
        ),
      ]),
      ts.createExpressionStatement(
        ts.createAssignment(
          ts.createElementAccess(ts.createIdentifier(localVariableName), ts.createIdentifier(typeNameParameter)),
          ts.createIdentifier(typeDefParameter),
        ),
      ),
    ]),
  );
}
