import fs from 'fs'
import path from 'path'
import { buildSchema, GraphQLSchema } from 'graphql'

export function parseGraphQLSchema(schemaInput: string): GraphQLSchema {
  try {
    let schemaString: string

    // List of paths to attempt
    const possiblePaths = [
      schemaInput, // As is (could be absolute)
      path.resolve(process.cwd(), schemaInput), // Relative to project root
      path.resolve(__dirname, schemaInput), // Relative to module directory
    ]

    // Find the first existing path
    const existingPath = possiblePaths.find((p) => fs.existsSync(p))

    if (existingPath) {
      // If a valid path is found, read the file
      schemaString = fs.readFileSync(existingPath, 'utf-8')
    } else {
      // If no valid path is found, assume it's a stringified schema
      schemaString = schemaInput
    }

    return buildSchema(schemaString)
  } catch (error) {
    console.error('Error parsing schema:', error)
    throw error
  }
}
