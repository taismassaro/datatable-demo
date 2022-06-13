import React from 'react'
import styled from 'styled-components'

interface PaginationProps {
  onChange?: (page: number) => void
  current: number
  size?: number
  total: number
}

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const Spacer = styled.div`
  width: 8px;
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

  const handleGoToPrevious = () => {
    onChange(current - 1)
  }

  const handleGoToNext = () => {
    onChange(current + 1)
  }

  return (
    <PaginationContainer>
      {total > 0 &&
        <>
          {`${currentPageStart}–${currentPageEnd} of ${total}`}
        </>}
        <Spacer />
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