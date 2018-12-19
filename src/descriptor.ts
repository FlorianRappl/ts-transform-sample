import * as ts from 'typescript';

function getTypeDescriptor(
  property: ts.PropertyDeclaration | ts.PropertySignature,
  typeChecker: ts.TypeChecker,
): ts.Expression {
  const { type } = property;

  if (!type) {
    if (property.initializer) {
      switch (property.initializer.kind) {
        case ts.SyntaxKind.StringLiteral:
          return ts.createLiteral('string');
        case ts.SyntaxKind.FirstLiteralToken:
          return ts.createLiteral('number');
      }
    }

    return ts.createLiteral('any');
  }

  return getDescriptor(type, typeChecker);
}

export function getDescriptor(type: ts.Node | undefined, typeChecker: ts.TypeChecker): ts.Expression {
  if (!type) {
    return ts.createLiteral('unknown');
  }

  switch (type.kind) {
    case ts.SyntaxKind.PropertySignature:
      return getDescriptor((type as ts.PropertySignature).type, typeChecker);
    case ts.SyntaxKind.StringKeyword:
      return ts.createLiteral('string');
    case ts.SyntaxKind.NumberKeyword:
      return ts.createLiteral('number');
    case ts.SyntaxKind.BooleanKeyword:
      return ts.createLiteral('boolean');
    case ts.SyntaxKind.AnyKeyword:
      return ts.createLiteral('any');
    case ts.SyntaxKind.TypeReference:
      const symbol = typeChecker.getSymbolAtLocation((type as ts.TypeReferenceNode).typeName);
      const declaration = ((symbol && symbol.declarations) || [])[0];
      return getDescriptor(declaration, typeChecker);
    case ts.SyntaxKind.ArrayType:
      return ts.createArrayLiteral([getDescriptor((type as ts.ArrayTypeNode).elementType, typeChecker)]);
    case ts.SyntaxKind.InterfaceDeclaration:
    case ts.SyntaxKind.TypeLiteral:
      return ts.createObjectLiteral(
        (type as ts.TypeLiteralNode).members.map(member =>
          ts.createPropertyAssignment(
            member.name || '',
            getTypeDescriptor(member as ts.PropertySignature, typeChecker),
          ),
        ),
      );
    default:
      throw new Error('Unknown type ' + ts.SyntaxKind[type.kind]);
  }
}
