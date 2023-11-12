import { analyzeSchema } from './analyze-schema'
import { generateMockData } from './generate-mock-data'
import { parseGraphQLSchema } from './parse-graphql-schema'

export { analyzeSchema } from './analyze-schema'
export { generateMockData } from './generate-mock-data'
export { parseGraphQLSchema } from './parse-graphql-schema'

const schemaString = `
  type Query {
    users: [User]
  }
  type User {
    id: ID
    name: String
  }
`

const parsedSchema = parseGraphQLSchema('../example/schema.graphql')
const analyzedSchema = analyzeSchema(parsedSchema)
const mockData = generateMockData(analyzedSchema)

console.log({ mockData })
