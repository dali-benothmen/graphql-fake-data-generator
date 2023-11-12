import fs from 'fs'
import path from 'path'
import { buildSchema, GraphQLSchema } from 'graphql'

function isLikelyFilePath(input: string): boolean {
  return input.endsWith('.graphql') || input.endsWith('.gql')
}

export function parseGraphQLSchema(schemaInput: string): GraphQLSchema {
  try {
    let schemaString: string

    if (isLikelyFilePath(schemaInput)) {
      try {
        const resolvedPath = path.resolve(__dirname, schemaInput)
        schemaString = fs.readFileSync(resolvedPath, 'utf-8')
      } catch (fileError) {
        console.error('Error reading schema file:', fileError)
        throw fileError
      }
    } else {
      schemaString = schemaInput
    }

    return buildSchema(schemaString)
  } catch (error) {
    console.error('Error parsing schema:', error)
    throw error
  }
}
