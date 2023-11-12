import fs from 'fs'
import path from 'path'
import { buildSchema, GraphQLSchema } from 'graphql'

export function parseGraphQLSchema(schemaInput: string): GraphQLSchema {
  try {
    let schemaString: string

    try {
      const resolvedPathCWD = path.resolve(process.cwd(), schemaInput)
      schemaString = fs.readFileSync(resolvedPathCWD, 'utf-8')
    } catch (directReadError) {
      try {
        const resolvedPathDirname = path.resolve(__dirname, schemaInput)
        schemaString = fs.readFileSync(resolvedPathDirname, 'utf-8')
      } catch (dirnameReadError) {
        // If both reads fail, assume it's a stringified schema
        schemaString = schemaInput
      }
    }

    return buildSchema(schemaString)
  } catch (error) {
    console.error('Error parsing schema:', error)
    throw error
  }
}
