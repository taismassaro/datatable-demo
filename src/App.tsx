

import React from 'react'
import { useMutation } from '@apollo/client'
import * as yup from 'yup'
import { DataTable } from './components'
import { DELETE_POST, GET_CREDENTIALS, CREATE_CREDENTIAL } from './queries'
import { format } from 'date-fns'

type DeletePostVariables = {
  id: string
}

type Credential = {
  id: string
  createdAt: string
  username: string
}

type QueryResult = {
  getCredentials: Credential[]
}

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

function App() {
  const [deletePost, {
    loading: deletePostLoading
  }] = useMutation(DELETE_POST) 

  function handleDeletePost ({ id }: DeletePostVariables) {
    deletePost({
      variables: {
        id
      },
      refetchQueries: [{ query: GET_CREDENTIALS }]
    })
  }

  return (
    <main className="App">
      <header>
        <h1>DataTable demo</h1>
      </header>

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
          label: 'Delete post',
          loading: deletePostLoading,
          action: handleDeletePost,
        }}
      />
    </main>
  )
}

export default App
