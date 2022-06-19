import { faker } from '@faker-js/faker'
import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefs = `
  type Credential {
    id: ID!
    createdAt: String!
    username: String!
  }

  type Query {
    getCredentials: [Credential]
  }

  type Mutation {
    createCredential: Credential
    deleteCredential(credentialId: ID!): [Credential]
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

const generateCredential = () => ({
  id: faker.datatype.uuid(),
  createdAt: faker.date.past(),
  username: faker.internet.userName()
})

let credentials = Array.from({ length: 3 }, generateCredential)

const mocks = {
  Credential: () => ({
    id: faker.datatype.uuid(),
    createdAt: faker.date.past(),
    username: faker.internet.userName()
  }),
  Query: () => ({
    getCredentials: () => credentials
  }),
  Mutation: () => ({
    createCredential: () => generateCredential()
  })
}

const schema = makeExecutableSchema({ typeDefs })

const schemaWithMocks = addMocksToSchema({ schema, mocks })

export default schemaWithMocks