import { buildSchema, GraphQLSchema, GraphQLObjectType, TypeNode } from 'graphql'
import { readFileSync } from 'fs'
import path from 'path'
import { faker } from '@faker-js/faker'
import { checkFilePath } from './utils/check-file-path'
import { rootFieldReturnArray } from './utils/root-field-return-array'
import { convertGraphQLTypeNodeToTypescript } from './utils/convert-graphql-type-node-to-typescript'

// Function to read and parse the schema
async function parseGraphQLSchema(schemaInput: string): Promise<GraphQLSchema> {
  try {
    let schemaString: string

    // Check if the input is a file path
    if (checkFilePath(schemaInput)) {
      schemaString = readFileSync(path.resolve(__dirname, schemaInput), 'utf-8')
    } else {
      schemaString = schemaInput
    }

    const schema = buildSchema(schemaString)

    return schema
  } catch (error) {
    console.error('Error reading or parsing schema:', error)
    throw error
  }
}

function analyzeSchema(schema: GraphQLSchema) {
  const typeMap = schema.getTypeMap()
  const schemaStructure: Record<string, Record<string, string>> = {}

  Object.keys(typeMap).forEach((typeName) => {
    if (!typeName.startsWith('__')) {
      const type = typeMap[typeName]

      if (type instanceof GraphQLObjectType) {
        schemaStructure[typeName] = {}

        const fields = type.getFields()

        Object.keys(fields).forEach((fieldName) => {
          const field = fields[fieldName]
          schemaStructure[typeName][fieldName] = field.type.toString()
        })
      }
    }
  })

  return schemaStructure
}
// Main function

const exampleSchema = `
    type User {
        id: ID!
        name: String!
    }

    type Query {
        users: [User!]!
    }
`

const main = async () => {
  const schema = await parseGraphQLSchema('../example/schema.graphql')
  const analyzedSchema = analyzeSchema(schema)
  const isArray = rootFieldReturnArray(schema, 'users')

  console.log({ analyzedSchema, isArray })
}

main().catch((error) => console.error(error))
