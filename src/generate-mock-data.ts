import { faker } from '@faker-js/faker'
import { AnalyzedSchema, AnalyzedFieldType } from './types' // Update with the actual path
import { randomize } from './utils/randomize'

type FieldCustomizationOptions = Record<string, () => any>

interface MockDataOptions<TQuery> {
  listLength?: number
  query?: Partial<Record<keyof TQuery, FieldCustomizationOptions>>
}

function generateMockData<TQuery>(
  analyzedSchema: AnalyzedSchema,
  options: MockDataOptions<TQuery> = {},
): Record<string, any> {
  const queryType = analyzedSchema.Query

  if (!queryType || queryType.kind !== 'OBJECT' || !queryType.fields) {
    throw new Error('The Query type is not correctly defined in the analyzed schema.')
  }

  const mockData: Record<string, any> = {}
  const queryFields = queryType.fields

  Object.keys(queryFields).forEach((queryFieldName) => {
    const queryField = queryFields[queryFieldName]
    const fieldGenerators = options.query?.[queryFieldName as keyof TQuery]

    mockData[queryFieldName] = generateMockForField(
      queryField,
      analyzedSchema,
      options,
      queryFieldName,
      fieldGenerators,
    )
  })

  return mockData
}

const generateMockForField = (
  field: AnalyzedFieldType,
  schema: AnalyzedSchema,
  options: MockDataOptions<any>,
  fieldName: string,
  customGenerators?: FieldCustomizationOptions,
): any => {
  if (field.isList) {
    const listLength = options.listLength ?? 2

    return Array.from({ length: listLength }).map(() =>
      generateMockBasedOnType(field.type, schema, options, fieldName, customGenerators),
    )
  } else {
    return generateMockBasedOnType(field.type, schema, options, fieldName, customGenerators)
  }
}

const generateMockBasedOnType = (
  typeName: string,
  schema: AnalyzedSchema,
  options: MockDataOptions<any>,
  fieldName: string,
  customGenerators?: FieldCustomizationOptions,
): any => {
  if (customGenerators && customGenerators[fieldName]) {
    return customGenerators[fieldName]()
  }

  switch (typeName) {
    case 'ID':
      return faker.string.uuid()
    case 'String':
      return faker.lorem.word()
    case 'Int':
      return faker.number.int()
    case 'Float':
      return faker.number.float()
    case 'Boolean':
      return faker.datatype.boolean()
    default:
      break
  }

  const typeInfo = schema[typeName]

  if (typeInfo) {
    if (typeInfo.kind === 'ENUM') {
      const enumValues = typeInfo.values

      return randomize(enumValues)
    } else if (typeInfo.kind === 'OBJECT') {
      const objectMock: Record<string, any> = {}

      Object.keys(typeInfo.fields).forEach((nestedFieldName) => {
        const field = typeInfo.fields[nestedFieldName]
        // Prepare a custom generator for the nested field if it exists
        const nestedCustomGenerator =
          customGenerators && customGenerators[nestedFieldName]
            ? { [nestedFieldName]: customGenerators[nestedFieldName] }
            : undefined

        objectMock[nestedFieldName] = generateMockForField(
          field,
          schema,
          options,
          nestedFieldName,
          nestedCustomGenerator,
        )
      })

      return objectMock
    }
  }

  return null
}

export { generateMockData }
