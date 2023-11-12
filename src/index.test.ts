import { describe, it, expect, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import { GraphQLSchema } from 'graphql'
import { parseGraphQLSchema } from './parse-graphql-schema'

vi.mock('fs')
vi.mock('path')

describe('parseGraphQLSchema', () => {
  it('reads schema from file when file exists', () => {
    const mockSchema = 'type Query { hello: String }'

    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockSchema)
    vi.spyOn(path, 'resolve').mockReturnValue('path/to/schema.graphql')

    const schema = parseGraphQLSchema('schema.graphql')

    expect(schema).toBeInstanceOf(GraphQLSchema)
    expect(fs.readFileSync).toHaveBeenCalledWith('path/to/schema.graphql', 'utf-8')
  })

  it('treats input as stringified schema when file does not exist', () => {
    const mockSchema = 'type Query { hello: String }'

    vi.spyOn(fs, 'existsSync').mockReturnValue(false)

    const schema = parseGraphQLSchema(mockSchema)

    expect(schema).toBeInstanceOf(GraphQLSchema)
  })

  it('throws an error for invalid schema', () => {
    const invalidSchema = 'invalid schema'

    vi.spyOn(fs, 'existsSync').mockReturnValue(false)

    expect(() => parseGraphQLSchema(invalidSchema)).toThrow()
  })

  it('logs and rethrows error on exception', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    const error = new Error('Test Error')

    vi.spyOn(fs, 'existsSync').mockImplementation(() => {
      throw error
    })

    expect(() => parseGraphQLSchema('schema.graphql')).toThrow(error)
    expect(consoleSpy).toHaveBeenCalledWith('Testing Error parsing schema:', error)
  })
})
