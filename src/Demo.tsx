import React from 'react'
import { format } from 'date-fns'
import { useMutation } from '@apollo/client'
import * as yup from 'yup'
import { DataTable } from './components'
import { GET_CREDENTIALS, CREATE_CREDENTIAL, DELETE_CREDENTIAL } from './queries'
import { QueryResult, Credential, DeleteCredentialVariables } from './types'
import styled from 'styled-components'

const RootContainer = styled.main`
  padding: 2rem;
  background-color: #f1f3f5;
  height: 100%;
`

const Header = styled.header`
  text-align: center;
`

function mapQueryToTable (data: QueryResult) {
  const head = (
    <>
      <th>Id</th>
      <th>Username</th>
      <th>Created at</th>
    </>
  )

  if (!data?.getCredentials) { return { head, body: [], validationData: {} } }

  const credentials = data?.getCredentials

  const body = credentials.map((credential: Credential) => {
    return {
      data: {
        id: credential.id
      },
      content: (
        <>
          <td>{credential.id}</td>
          <td>{credential.username}</td>
          <td>{format(new Date(credential.createdAt), 'PPP')}</td>
        </>
      ),
      rowActionParams: {
        show: true,
        variables: {
          id: credential.id
        }
      }
    }
  })

  return {
    head,
    body,
    validationData: { count: body?.length }
  }
}

function Demo () {
  const [deleteCredential, {
    loading: deleteCredentialLoading
  }] = useMutation(DELETE_CREDENTIAL) 

  function handleDeleteCredential ({ id }: DeleteCredentialVariables) {
    deleteCredential({
      variables: {
        credentialId: id
      },
      refetchQueries: [{ query: GET_CREDENTIALS }]
    })
  }

  return (
    <RootContainer>
      <Header>
        <h1>DataTable demo</h1>
      </Header>

      <DataTable
        queryGetItems={GET_CREDENTIALS}
        emptyTableText='No credentials generated yet.'
        mapQueryToTableRows={mapQueryToTable}
        addRow={{
          mutation: CREATE_CREDENTIAL,
          buttonText: 'Generate credential',
          validationSchema: yup.object().shape({
            count: yup.number().lessThan(5, 'You can only have 5 credentials at the same time.')
          })
        }}
        rowAction={{
          label: 'Delete credential',
          loading: deleteCredentialLoading,
          action: handleDeleteCredential,
        }}
      />
    </RootContainer>
  )
}

export default Demo