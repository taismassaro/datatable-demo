import React, { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import styled from 'styled-components'
import { AddRowComponentProps } from './types'

const AddRowContainer = styled.div`
  display: flex;
  align-items: center;
`

const PrimaryButton = styled.button`
  padding: .5rem;
  background-color: #343a40;
  border: none;
  border-radius: .25rem;
  font-size: 1rem;
  color: #f8f9fa;

  :hover {
    background-color: #212529;
    cursor: pointer;
  }
  `

const ErrorContainer = styled.div`
  margin-left: 1rem;
  padding: .5rem;
  background-color: #ffe3e3;
  border: 1px solid #ff8787;
  border-radius: .25rem; 
  color: #c92a2a;
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
    <AddRowContainer>
      <PrimaryButton
        data-testid='datatable-add'
        onClick={handleClick}
      >
        {buttonText}
      </PrimaryButton>

      {(loading) && 'Loading...'}

      {error && <ErrorContainer>{error}</ErrorContainer>}
    </AddRowContainer>
  )
}

export default AddRow
