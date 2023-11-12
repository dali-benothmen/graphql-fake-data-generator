import { describe, it, expect, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql'
import { parseGraphQLSchema } from './parse-graphql-schema'
import { analyzeSchema } from './analyze-schema'
import { generateMockData } from './generate-mock-data'
import { AnalyzedSchema, AnalyzedObjectType, AnalyzedEnumType } from './types' // Update with the actual path

vi.mock('fs')
vi.mock('path')

function isAnalyzedObjectType(type: any): type is AnalyzedObjectType {
  return type.kind === 'OBJECT'
}

function isAnalyzedEnumType(type: any): type is AnalyzedEnumType {
  return type.kind === 'ENUM'
}

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
})

describe('analyzeSchema', () => {
  it('analyzes schema with object types', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          hello: { type: GraphQLString },
        },
      }),
    })

    const analyzed = analyzeSchema(schema)
    const queryType = analyzed.Query

    if (isAnalyzedObjectType(queryType)) {
      expect(queryType.kind).toBe('OBJECT')
      expect(queryType.fields.hello.type).toBe('String')
    } else {
      throw new Error('Expected Query to be an AnalyzedObjectType')
    }
  })

  it('analyzes schema with enum types', () => {
    const myEnum = new GraphQLEnumType({
      name: 'MyEnum',
      values: {
        ONE: { value: 1 },
        TWO: { value: 2 },
      },
    })

    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          myEnum: { type: myEnum },
        },
      }),
    })

    const analyzed = analyzeSchema(schema)
    const myEnumType = analyzed.MyEnum

    if (isAnalyzedEnumType(myEnumType)) {
      expect(myEnumType.values).toEqual(['ONE', 'TWO'])
    } else {
      throw new Error('Expected MyEnum to be an AnalyzedEnumType')
    }
  })

  it('analyzes field types including lists and non-nulls', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          numbers: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) },
        },
      }),
    })

    const analyzed = analyzeSchema(schema)
    const queryType = analyzed.Query

    if (isAnalyzedObjectType(queryType)) {
      const numbersField = queryType.fields.numbers

      expect(numbersField.type).toBe('Int')
      expect(numbersField.isList).toBe(true)
      expect(numbersField.isNonNull).toBe(true)
    } else {
      throw new Error('Expected Query to be an AnalyzedObjectType')
    }
  })
})

describe('generateMockData', () => {
  it('generates mock data for basic types', () => {
    const schema: AnalyzedSchema = {
      Query: {
        kind: 'OBJECT',
        fields: {
          id: { type: 'ID', isList: false, isNonNull: true },
          name: { type: 'String', isList: false, isNonNull: false },
        },
      },
    }

    const mockData = generateMockData(schema)
    expect(mockData.id).toBeDefined()
    expect(typeof mockData.id).toBe('string')
    expect(mockData.name).toBeDefined()
    expect(typeof mockData.name).toBe('string')
  })

  it('handles list fields', () => {
    const schema: AnalyzedSchema = {
      Query: {
        kind: 'OBJECT',
        fields: {
          numbers: { type: 'Int', isList: true, isNonNull: false },
        },
      },
    }

    const mockData = generateMockData(schema, { listLength: 3 })
    expect(Array.isArray(mockData.numbers)).toBe(true)
    expect(mockData.numbers).toHaveLength(3)
  })

  it('uses custom generators', () => {
    const customNameGenerator = () => 'customName'
    const schema: AnalyzedSchema = {
      Query: {
        kind: 'OBJECT',
        fields: {
          name: { type: 'String', isList: false, isNonNull: false },
        },
      },
    }

    const options = {
      query: {
        name: {
          name: customNameGenerator,
        },
      },
    }

    const mockData = generateMockData(schema, options)

    expect(mockData.name).toBe('customName')
  })
})
