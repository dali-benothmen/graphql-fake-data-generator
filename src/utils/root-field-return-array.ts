import { GraphQLSchema } from 'graphql'

export function rootFieldReturnArray(schema: GraphQLSchema, fieldName: string): boolean {
  const queryType = schema.getQueryType()

  if (!queryType) {
    throw new Error('Query type not found in the schema.')
  }

  const field = queryType.getFields()[fieldName]

  if (!field) {
    throw new Error(`Field ${fieldName} not found in Query type.`)
  }

  return field.type.toString().startsWith('[')
}
