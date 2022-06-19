

import React from 'react'
import { useMutation } from '@apollo/client'
import * as yup from 'yup'
import { DataTable } from './components'
import { GET_POSTS, CREATE_POST, DELETE_POST } from './queries'
import { loremIpsum } from 'lorem-ipsum'

type DeletePostVariables = {
  id: string
}

type Post = {
  id: string
  title: string
  user: {
    name: string
  }
}

type QueryResult = {
  posts: {
    data: Post[]
  }
}

function mapQueryToTable (data: QueryResult) {
  const head = (
    <>
      <th>Id</th>
      <th>Title</th>
      <th>Written by</th>
    </>
  )

  if (!data?.posts) { return { head, body: [], validationData: {} } }

  const posts = data?.posts?.data

  const body = posts.map((post: Post) => {
    return {
      data: {
        id: post.id
      },
      content: (
        <>
          <td>{post.id}</td>
          <td>{post.title}</td>
          <td>{post.user?.name}</td>
        </>
      ),
      rowActionParams: {
        show: true,
        variables: {
          id: post.id
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
      refetchQueries: [{ query: GET_POSTS }]
    })
  }

  return (
    <main className="App">
      <header>
        <h1>DataTable demo</h1>
      </header>

      <DataTable
        queryGetItems={GET_POSTS}
        emptyTableText='No posts generated yet.'
        mapQueryToTableRows={mapQueryToTable}
        addRow={{
          mutation: CREATE_POST,
          variables: { title: loremIpsum({ count: 5, units: 'words' }), body: loremIpsum({ count: 3, units: 'words' })},
          buttonText: 'Generate post',
          validationSchema: yup.object().shape({
            itemsCount: yup.number().lessThan(5, 'You can only have 5 posts at the same time.')
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
