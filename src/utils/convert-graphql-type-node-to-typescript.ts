import { TypeNode } from 'graphql'

export function convertGraphQLTypeNodeToTypescript(typeNode: TypeNode): string {
  switch (typeNode.kind) {
    case 'NamedType':
      // Map GraphQL scalar types to TypeScript types
      switch (typeNode.name.value) {
        case 'String':
        case 'ID':
          return 'string'
        case 'Int':
        case 'Float':
          return 'number'
        case 'Boolean':
          return 'boolean'
        // Add other custom scalar type mappings if needed
        default:
          return typeNode.name.value
      }

    case 'ListType':
      // For lists, return the type name in an array
      return `${convertGraphQLTypeNodeToTypescript(typeNode.type)}[]`

    case 'NonNullType':
      // For non-null types, return the type name without the '!' at the end
      return convertGraphQLTypeNodeToTypescript(typeNode.type)
  }

  return 'unknown'
}
