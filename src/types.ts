export enum SchemaTypeKind {
  OBJECT = 'OBJECT',
  ENUM = 'ENUM',
  SCALAR = 'SCALAR',
  INTERFACE = 'INTERFACE',
  UNION = 'UNION',
}

export interface AnalyzedFieldType {
  type: string
  isList: boolean
  isNonNull: boolean
}

export interface AnalyzedEnumType {
  kind: SchemaTypeKind.ENUM
  values: string[]
}

export interface AnalyzedObjectType {
  kind: SchemaTypeKind.OBJECT
  fields: Record<string, AnalyzedFieldType>
}

export type AnalyzedType = AnalyzedObjectType | AnalyzedEnumType

export interface AnalyzedSchema {
  [typeName: string]: AnalyzedType
}
