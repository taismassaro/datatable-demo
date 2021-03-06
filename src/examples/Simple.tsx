import React from 'react'
import { format } from 'date-fns'
import { DataTable, TableHeadCell, TableBodyCell } from '../components'
import { GET_CREDENTIALS } from '../queries'
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
      content: (
        <>
          <TableBodyCell>{credential.id}</TableBodyCell>
          <TableBodyCell>{credential.username}</TableBodyCell>
          <TableBodyCell>{format(new Date(credential.createdAt), 'yyyy-MM-dd')}</TableBodyCell>
        </>
      )
    }
  })

  return {
    head,
    body,
    validationData: { count: body?.length }
  }
}

function SimpleDemo () {
  return (
    <>
      <h2>Simple table with GraphQL data</h2>

      <DataTable
        queryGetItems={GET_CREDENTIALS}
        emptyTableText='No credentials generated yet.'
        mapQueryToTableRows={mapQueryToTable}
      />
      </>
  )
}

export default SimpleDemo
