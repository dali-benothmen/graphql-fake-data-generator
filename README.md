# GraphQL Fake Data Generator

## Description

GraphQL Fake Data Generator is a powerful and flexible tool designed to generate mock data for GraphQL schemas. It provides an easy and efficient way to create realistic and customizable mock data based on your GraphQL schema, which is ideal for testing, development, and demonstration purposes.

## Installation

```bash
npm install graphql-fake-data-generator
```

```bash
yarn add graphql-fake-data-generator
```

```bash
pnpm add graphql-fake-data-generator
```

## Basic Usage

### Create Schema from String

To create a GraphQL schema from a string:

```js
const schemaString = `
  type Query {
    users: [User]
  }
  type User {
    id: ID
    name: String
  }
`
```

### Parse Schema

Parse the schema to convert it into a usable format:

```js
import { parseGraphQLSchema } from 'graphql-fake-data-generator'

const parsedSchema = parseGraphQLSchema(schema)
```

### Analyze Schema

Analyze the parsed schema to understand its structure:

```js
import { analyzeSchema } from 'graphql-fake-data-generator'

const analyzedSchema = analyzeSchema(parsedSchema)
```

### Generate Mock Data

Generate mock data based on the analyzed schema:

```js
import { generateMockData } from 'graphql-fake-data-generator'

const mockData = generateMockData(analyzedSchema)
```

### Example:

```js
import { parseGraphQLSchema, analyzeSchema, generateMockData } from 'graphql-fake-data-generator'

const schemaString = `
  type Query {
    users: [User]
  }
  type User {
    id: ID
    name: String
  }
`

const parsedSchema = parseGraphQLSchema(schema)
const analyzedSchema = analyzeSchema(parsedSchema)
const mockData = generateMockData(analyzedSchema)
```

### Result:

```js
{
  users: [
    {
       id": "14c56ec5-1f79-4d9e-aab9-759ba6dcc950",
       name": "terra",
       email": "conscendo"
    }
  ]
}
```

## Load Schema from File

To load a GraphQL schema from a file:

```js
import { readFileSync } from 'fs'
import { parseGraphQLSchema, analyzeSchema, generateMockData } from 'graphql-fake-data-generator'

// Method 1: Read existing GraphQL schema file and convert it into string.
const schemaString = readFileSync('path/to/your/schema.graphql', 'utf-8')
const parsedSchema = parseGraphQLSchema(schemaString)

// Method 2: Pass the GraphQL schema file path directly to the parseGraphQLSchema function.
const parsedSchema = parseGraphQLSchema('./schema.graphql')
const analyzedSchema = analyzeSchema(parsedSchema)
const mockData = generateMockData(analyzedSchema)
```

## Generate Mock Data with Options

### Customizing List Length

Specify the length of lists in the generated mock data:

```js
const mockDataWithListLength = generateMockData(analyzedSchema, {
  listLength: 10, // Specifies the number of items in list fields
})
```

NB: Please be aware that if your schema does not return an array, the 'listLength' parameter will be unavailable. Including it in the options will result in an error.

### Customizing Data

Provide custom data generators for specific fields:
If the default data generated appears unrealistic, you have the option to customize the output for specific fields

```js
import { faker } from 'faker-js/faker'

const mockDataWithCustomData = generateMockData(analyzedSchema, {
  query: {
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
  },
})
```

In the example above, the `name` and `email` fields of the `users` query will use the provided custom generator functions. This allows for specific customization of the mock data returned for these fields.

### Output

```js
{
  users: [
    {
      id=: "14c56ec5-1f79-4d9e-aab9-759ba6dcc950",
      name: "Claude Hyatt",
      email: "Janessa23@hotmail.com"
    }
  ]
}
```
