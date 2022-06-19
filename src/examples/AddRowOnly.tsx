import React from 'react'
import { format } from 'date-fns'
import { DataTable, TableHeadCell, TableBodyCell } from '../components'
import { GET_CREDENTIALS, CREATE_CREDENTIAL } from '../queries'
import { QueryResult, Credential } from '../types'

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
      data: {
        id: credential.id
      },
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

function AddRowExample () {
  return (
    <>
      <h2>With ability to add new rows</h2>

      <DataTable
        queryGetItems={GET_CREDENTIALS}
        emptyTableText='No credentials generated yet.'
        mapQueryToTableRows={mapQueryToTable}
        addRow={{
          mutation: CREATE_CREDENTIAL,
          buttonText: 'Generate credential'
        }}
      />
      </>
  )
}

export default AddRowExample
