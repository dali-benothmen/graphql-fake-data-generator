import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLEnumType,
  isEnumType,
  isObjectType,
  getNamedType,
  isNonNullType,
  isListType,
  GraphQLField,
  GraphQLNonNull,
} from 'graphql'
import { AnalyzedSchema, AnalyzedObjectType, AnalyzedFieldType, AnalyzedEnumType } from './types'

function analyzeSchema(schema: GraphQLSchema): AnalyzedSchema {
  const typeMap = schema.getTypeMap()
  const schemaStructure: AnalyzedSchema = {}

  Object.keys(typeMap).forEach((typeName) => {
    const type = typeMap[typeName]

    if (isObjectType(type)) {
      schemaStructure[typeName] = analyzeObjectType(type)
    } else if (isEnumType(type)) {
      schemaStructure[typeName] = analyzeEnumType(type)
    }
    // Add here additional handling for other types if needed
  })

  return schemaStructure
}

function analyzeObjectType(objectType: GraphQLObjectType): AnalyzedObjectType {
  const fields = objectType.getFields()
  const analyzedFields: Record<string, AnalyzedFieldType> = {}

  Object.keys(fields).forEach((fieldName) => {
    analyzedFields[fieldName] = analyzeField(fields[fieldName])
  })

  return { kind: 'OBJECT', fields: analyzedFields }
}

function analyzeEnumType(enumType: GraphQLEnumType): AnalyzedEnumType {
  const values = enumType.getValues().map((enumValue) => enumValue.name)
  return { kind: 'ENUM', values }
}

function analyzeField(field: GraphQLField<any, any>): AnalyzedFieldType {
  let type = field.type
  let isList = false

  if (isNonNullType(type)) {
    type = type.ofType
  }

  if (isListType(type)) {
    isList = true
    type = type.ofType
  }

  if (type instanceof GraphQLNonNull) {
    type = type.ofType
  }

  const namedType = getNamedType(type)

  return {
    type: namedType.toString(),
    isList: isList,
    isNonNull: isNonNullType(field.type),
  }
}

export { analyzeSchema }
