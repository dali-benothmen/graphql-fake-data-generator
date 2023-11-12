import { buildSchema, GraphQLSchema, getNamedType, isEnumType, isObjectType, isListType, isNonNullType } from 'graphql'
import { readFileSync } from 'fs'
import path from 'path'
import { faker } from '@faker-js/faker'
import { checkFilePath } from './utils/check-file-path'
import { AnalyzedFieldType, AnalyzedSchema, SchemaTypeKind } from './types'

// Function to read and parse the schema
async function parseGraphQLSchema(schemaInput: string): Promise<GraphQLSchema> {
  try {
    let schemaString: string

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
function analyzeSchema(schema: GraphQLSchema): AnalyzedSchema {
  const typeMap = schema.getTypeMap()
  const schemaStructure: AnalyzedSchema = {}

  Object.keys(typeMap).forEach((typeName) => {
    if (!typeName.startsWith('__')) {
      const type = typeMap[typeName]

      if (isEnumType(type)) {
        schemaStructure[typeName] = {
          kind: SchemaTypeKind.ENUM,
          values: type.getValues().map((value) => value.name),
        }
      } else if (isObjectType(type)) {
        const fields = type.getFields()
        const analyzedFields: Record<string, AnalyzedFieldType> = {}

        Object.keys(fields).forEach((fieldName) => {
          const fieldType = getNamedType(fields[fieldName].type)
          analyzedFields[fieldName] = {
            type: fieldType.toString(),
            isList: isListType(fields[fieldName].type),
            isNonNull: isNonNullType(fields[fieldName].type),
          }
        })

        schemaStructure[typeName] = {
          kind: SchemaTypeKind.OBJECT,
          fields: analyzedFields,
        }
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

  console.log({ analyzedSchema })
}

main().catch((error) => console.error(error))
