import fs from 'fs'
import path from 'path'
import { buildSchema, GraphQLSchema } from 'graphql'

export function parseGraphQLSchema(schemaInput: string): GraphQLSchema {
  try {
    let schemaString: string

    // Determine the base path
    let basePath
    if (require.main && require.main.filename) {
      basePath = path.dirname(require.main.filename)
    } else {
      basePath = __dirname // Fallback to __dirname if require.main is not available
    }

    // Attempt to construct the full path from the base path
    const filePath = path.resolve(basePath, schemaInput)

    if (fs.existsSync(filePath)) {
      // Read the file if it exists
      schemaString = fs.readFileSync(filePath, 'utf-8')
    } else {
      // Treat as a stringified schema if the file doesn't exist
      schemaString = schemaInput
    }

    return buildSchema(schemaString)
  } catch (error) {
    console.error('Error parsing schema:', error)
    throw error
  }
}
