import { faker } from '@faker-js/faker'
import { addMocksToSchema, createMockStore, IMockStore, Ref } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'

const schema = makeExecutableSchema({ 
  typeDefs: `
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
})

const store = createMockStore({ schema })

const generateCredential = () => ({
  id: faker.datatype.uuid(),
  createdAt: faker.date.past().toString(),
  username: faker.internet.userName()
})

// Sets the initial return value of `getCredential` 
// to an array of 3 uniquely generated credential objects
store.set('Query', 'ROOT', 'getCredentials', Array.from({ length: 3 }, generateCredential))

const mocks = {
  Credential: generateCredential,
  Query: () => ({
    // store.get returns an array of references to the actual entities in the store
    // in the form of an object with a `key` and a `typeName` properties
    getCredentials: () => store.get('Query', 'ROOT', 'getCredentials') as Ref[]
  }),
  Mutation: () => ({
    createCredential: () => {},
    deleteCredential: () => {}
  })
}

const resolvers = (store: IMockStore) => ({
  Mutation: {
    createCredential: () => {
      const newCredential = generateCredential()
      const credentials = store.get('Query', 'ROOT', 'getCredentials') as Ref[]
      store.set('Query', 'ROOT', 'getCredentials', [...credentials, newCredential])

      return newCredential
    },
    // @ts-ignore
    deleteCredential: (_, { credentialId }) => {
      const credentials = store.get('Query', 'ROOT', 'getCredentials') as Ref[]
      
      const hasCredentialToDelete = store.has('Credential', credentialId)

      if (!hasCredentialToDelete) { 
        throw new Error(`Couldn't find credential with id ${credentialId}`)
      }

      // Here, we use the reference from the store.get to find the actual item
      // to be deleted from the Credentials list
      store.set('Query', 'ROOT', 'getCredentials', credentials.filter(
        ref => store.get(ref, 'id') !== credentialId
      ))

      return credentials
    }
  }
})

const schemaWithMocks = addMocksToSchema({ schema, mocks, resolvers })

export default schemaWithMocks