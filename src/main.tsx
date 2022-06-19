import React from 'react'
import { ApolloProvider } from '@apollo/client'
import ReactDOM from 'react-dom/client'
import client from './api/client'
import './static/index.css'
import Demo from './Demo'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Demo />
    </ApolloProvider>
  </React.StrictMode>
)
