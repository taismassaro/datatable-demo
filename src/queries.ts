import { gql } from '@apollo/client'

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

export const DELETE_CREDENTIAL = gql`
  mutation DeleteCredential($credentialId: ID!) {
    deleteCredential(credentialId: $credentialId) {
      id
    }
  }
`
