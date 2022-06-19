import React, { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import styled from 'styled-components'
import { AddRowComponentProps } from './types'

const WarningBlock = styled.div`
  padding: 8px;
`

function AddRow ({
  buttonText,
  validationData,
  validationSchema,
  error,
  setError,
  refetchQuery,
  queryVariables,
  mutation,
  mutationVariables
}: AddRowComponentProps) {
  const apolloClient = useApolloClient()

  const [loading, setLoading] = useState<boolean>(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await apolloClient.mutate({
        mutation: mutation,
        variables: mutationVariables,
        refetchQueries: [{ query: refetchQuery, variables: queryVariables }]
      })

      setError('')
      setLoading(false)

    } catch (mutationError) {
      setError(`${mutationError}`)
      setLoading(false)
    }
  }

  const handleClick = async () => {
    try {
      validationSchema?.validateSync(validationData)
      await handleConfirm()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        data-testid='datatable-add'
        onClick={handleClick}
      >
        {buttonText}
      </button>

      {(loading) && 'Loading...'}

      {error && <WarningBlock>{error}</WarningBlock>}
    </div>
  )
}

export default AddRow
