import { GraphQLSchema, buildSchema } from 'graphql'
import { readFileSync } from 'fs'
import path from 'path'
import { checkFilePath } from './utils/check-file-path'

function parseGraphQLSchema(schemaInput: string): GraphQLSchema {
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

export { parseGraphQLSchema }
