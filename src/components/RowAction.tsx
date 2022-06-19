import React from 'react'
import { BaseButton } from './styled/Button'
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
    <BaseButton onClick={handleClick} disabled={disabled}>
      {label}
    </BaseButton>
  )
}

export default RowAction
