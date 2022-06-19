import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import Pagination from './Pagination'
import { DataTableProps } from './types'
import RowAction from './RowAction'
import AddRow from './AddRow'
import styled from 'styled-components'

const PAGE_SIZE = 10

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: white;
  opacity: 0.5;
`

const TableContainer = styled.div`
  position: relative;
  background-color: #f8f9fa;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: .5rem;
`

function DataTable ({
  // LIST ITEMS
  queryGetItems,
  queryVariables,
  emptyTableText,
  mapQueryToTableRows,
  additionalQueryOptions = {},
  // ADD ITEM
  addRow,
  // ROW ACTION
  rowAction
}: DataTableProps) {

  // Load table data
  const { loading, data } = useQuery(queryGetItems, { 
    variables: queryVariables, ...additionalQueryOptions 
  })

  const { head, body, validationData } = mapQueryToTableRows(data)

  // Add row mutation states
  const [addRowError, setAddRowError] = useState('')

  // Pagination
  const [pageIndex, setPageIndex] = useState(1)
  const page = body?.slice(0 + PAGE_SIZE * (pageIndex - 1), PAGE_SIZE * pageIndex)

  // Row action
  if (rowAction) {
    page?.map(row => {
      const {
        show = true,
        variables,
        disabled = false,
      } = row.rowActionParams
      if (show) {
        row.action = (
          <td>
            <RowAction
              label={rowAction.label}
              rowData={{ data: row, variables }}
              onConfirm={handleRowActionConfirm}
              disabled={disabled}
            />
          </td>
        )
      }
    })
  }

  function handleRowActionConfirm ({ variables }: { variables: Record<string, string>}) {
    setAddRowError('')
    rowAction?.action(variables)
  }

  if (loading) {
    return (
      <div data-testid='DataTable-loader'>
        Loading...
      </div>
    )
  }

  return (
    <TableContainer>
      {/* Set loading state to table when performing row action */}
      {rowAction?.loading && (
        <LoadingOverlay>
          Loading...
        </LoadingOverlay>
      )}

      {addRow && (
        <>
          <AddRow
            buttonText={addRow.buttonText}
            validationData={validationData}
            validationSchema={addRow.validationSchema}
            error={addRowError}
            setError={setAddRowError}
            refetchQuery={queryGetItems}
            queryVariables={queryVariables}
            mutation={addRow.mutation}
            mutationVariables={addRow.variables}
          />
        </>
      )}

      {body?.length > 0 ? (
        <>
          <Pagination
            current={pageIndex}
            total={body.length}
            size={PAGE_SIZE}
            onChange={setPageIndex}
          />
          <table>
            <thead>
              <tr>
              {head}
              {rowAction && <th/>}
              </tr>
            </thead>
            <tbody>
              {page.map(({ content, action }, i) => (
                <tr key={i}>
                  {content}
                  {rowAction && (action || <td />)}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        emptyTableText
      )}
    </TableContainer>
  )
}

export default DataTable
