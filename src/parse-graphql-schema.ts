import fs from 'fs'
import path from 'path'
import { buildSchema, GraphQLSchema } from 'graphql'

export function parseGraphQLSchema(schemaInput: string): GraphQLSchema {
  try {
    let schemaString: string

    const filePath = path.join(__dirname, schemaInput)

    if (fs.existsSync(filePath)) {
      schemaString = fs.readFileSync(filePath, 'utf-8')
    } else {
      schemaString = schemaInput
    }

    return buildSchema(schemaString)
  } catch (error) {
    console.error('Error parsing schema:', error)
    throw error
  }
}
