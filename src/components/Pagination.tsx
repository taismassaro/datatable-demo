import React from 'react'
import styled from 'styled-components'
import { BaseButton } from './styled/Button'
import { SpacerHorizontal } from './styled/Spacer'
import { PaginationProps } from './types'

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
      <BaseButton
        disabled={currentPage <= 1 || total === 0}
        onClick={handleGoToPrevious}
      >
        {'<'}
      </BaseButton>
      <BaseButton
        disabled={currentPage === lastPage || total === 0}
        onClick={handleGoToNext}
      >
        {'>'}
      </BaseButton>
    </PaginationContainer>
  )
}

export default Pagination