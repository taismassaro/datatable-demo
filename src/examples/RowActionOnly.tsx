import React from 'react'
import { useMutation } from '@apollo/client'
import { format } from 'date-fns'
import { DataTable, TableHeadCell, TableBodyCell } from '../components'
import { GET_CREDENTIALS, DELETE_CREDENTIAL } from '../queries'
import { QueryResult, Credential, DeleteCredentialVariables } from '../types'

function mapQueryToTable (data: QueryResult) {
  const head = (
    <>
      <TableHeadCell>Id</TableHeadCell>
      <TableHeadCell>Username</TableHeadCell>
      <TableHeadCell>Created at</TableHeadCell>
    </>
  )

  if (!data?.getCredentials) { return { head, body: [], validationData: {} } }

  const credentials = data?.getCredentials

  const body = credentials.map((credential: Credential) => {
    return {
      content: (
        <>
          <TableBodyCell>{credential.id}</TableBodyCell>
          <TableBodyCell>{credential.username}</TableBodyCell>
          <TableBodyCell>{format(new Date(credential.createdAt), 'yyyy-MM-dd')}</TableBodyCell>
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

function RowActionExample () {
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
    <>
      <h2>With ability to perform mutation on row data</h2>

      <DataTable
        queryGetItems={GET_CREDENTIALS}
        emptyTableText='No credentials generated yet.'
        mapQueryToTableRows={mapQueryToTable}
        rowAction={{
          label: 'Delete credential',
          loading: deleteCredentialLoading,
          action: handleDeleteCredential,
        }}
      />
      </>
  )
}

export default RowActionExample
