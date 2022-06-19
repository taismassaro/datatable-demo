import React from 'react'
import { RowActionComponentProps } from './types'

function RowAction ({
  label,
  rowData,
  onConfirm,
  disabled,
}: RowActionComponentProps) {

  function handleClick () {
    onConfirm({ variables: rowData.variables })
  }

  return (
    <button onClick={handleClick} disabled={disabled}>
      {label}
    </button>
  )
}

export default RowAction
