export type SchemaTypeKind = 'OBJECT' | 'ENUM' | 'SCALAR' | 'INTERFACE' | 'UNION'

export interface AnalyzedFieldType {
  type: string
  isList: boolean
  isNonNull: boolean
}

export interface AnalyzedEnumType {
  kind: 'ENUM'
  values: string[]
}

export interface AnalyzedObjectType {
  kind: 'OBJECT'
  fields: Record<string, AnalyzedFieldType>
}

export type AnalyzedType = AnalyzedObjectType | AnalyzedEnumType

export interface AnalyzedSchema {
  [typeName: string]: AnalyzedType
}
