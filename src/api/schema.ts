import { faker } from '@faker-js/faker'
import { addMocksToSchema, createMockStore, IMockStore } from '@graphql-tools/mock'
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

const schema = makeExecutableSchema({ typeDefs })
const store = createMockStore({ schema })

const generateCredential = () => ({
  id: faker.datatype.uuid(),
  createdAt: faker.date.past().toString(),
  username: faker.internet.userName()
})

store.set('Query', 'ROOT', 'getCredentials', Array.from({ length: 3 }, generateCredential))

const mocks = {
  Credential: generateCredential,
  Query: () => ({
    getCredentials: () => store.get('Query', 'ROOT', 'getCredentials') as Credential[]
  }),
  Mutation: () => ({
    createCredential: () => {}
  })
}

const resolvers = (store: IMockStore) => ({
  Mutation: {
    createCredential: () => {
      const newCredential = generateCredential()
      const credentials = store.get('Query', 'ROOT', 'getCredentials') as Credential[]
      store.set('Query', 'ROOT', 'getCredentials', [...credentials, newCredential])

      return newCredential
    }
  }
})

const schemaWithMocks = addMocksToSchema({ schema, mocks, resolvers })

export default schemaWithMocks