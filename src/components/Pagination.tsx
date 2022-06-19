import React from 'react'
import styled from 'styled-components'
import { PaginationProps } from './types'

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const SpacerHorizontal = styled.div`
  width: 1rem;
`

function Pagination ({
  onChange = () => null,
  current,
  size = 10,
  total,
}: PaginationProps) {
  const lastPage = Math.ceil(total / size)
  const currentPage = Math.max(1, Math.min(current, lastPage))
  const currentPageStart = (currentPage - 1) * size + 1
  const currentPageEnd = Math.min(currentPage * size, total)

  function handleGoToPrevious () {
    onChange(current - 1)
  }

  function handleGoToNext () {
    onChange(current + 1)
  }

  return (
    <PaginationContainer>
      {total > 0 &&
        <>
          {`${currentPageStart}–${currentPageEnd} of ${total}`}
        </>}
        <SpacerHorizontal />
      <button
        disabled={currentPage <= 1 || total === 0}
        onClick={handleGoToPrevious}
      >
        {'<'}
      </button>
      <button
        disabled={currentPage === lastPage || total === 0}
        onClick={handleGoToNext}
      >
        {'>'}
      </button>
    </PaginationContainer>
  )
}

export default Pagination