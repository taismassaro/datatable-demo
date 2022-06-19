import { gql } from "@apollo/client"

export const GET_CREDENTIALS = gql`
  query GetCredentials {
    getCredentials {
      id
      createdAt
      username
    }
  }
`

export const CREATE_CREDENTIAL = gql`
  mutation CreateCredential {
    createCredential {
      id
      createdAt
      username
    }
  }
`

// export const DELETE_CREDENTIAL = gql`
//   mutation DeleteCredential($credentialId: ID!) {
//     disableApiCredentials(credentialId: $credentialId) {
//       id
//     }
//   }
// `

export const CREATE_POST = gql`
  mutation (
    $input: CreatePostInput!
  ) {
    createPost(input: $input) {
      id
      title
      body
    }
  }
`

export const DELETE_POST = gql`
  mutation (
    $id: ID!
  ) {
    deletePost(id: $id)
  }
`