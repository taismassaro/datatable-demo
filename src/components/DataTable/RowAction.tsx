import React from 'react'
import { RowActionComponentProps } from './types'

const RowAction = ({
  label,
  rowData,
  onConfirm,
  disabled,
}: RowActionComponentProps) => {

  const handleClick = () => {
      onConfirm({ variables: rowData.variables })
  }

  return (
    <>
      <button onClick={handleClick} disabled={disabled}>
        {label}
      </button>
    </>
  )
}

export default RowAction
