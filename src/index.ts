import { analyzeSchema } from './analyze-schema'
import { generateMockData } from './generate-mock-data'
import { parseGraphQLSchema } from './parse-graphql-schema'
import { faker } from '@faker-js/faker'

const exampleSchema = `
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Query {
        users: [User!]!
    }
`

type Query = {
  users: User[]
}

type User = {
  id: string
  name: string
  email: string
}

const main = async () => {
  const schema = await parseGraphQLSchema(exampleSchema)
  const analyzedSchema = analyzeSchema(schema)
  const generatedMockData = generateMockData<Query>(analyzedSchema, {
    listLength: 5,
    query: {
      users: {
        name: () => faker.person.fullName(),
        email: () => faker.internet.email(),
      },
    },
  })

  console.log({ generatedMockData: JSON.stringify(generatedMockData) })
}

main().catch((error) => console.error(error))
