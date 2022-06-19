import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import styled from 'styled-components'
import { LoadingOverlay } from './styled/LoadingOverlay'
import { SpacerVertical } from './styled/Spacer'
import { DataTableProps } from './types'
import AddRow from './AddRow'
import RowAction from './RowAction'
import Pagination from './Pagination'

const PAGE_SIZE = 10

const DataTableContainer = styled.div`
  position: relative;
  background-color: #f8f9fa;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: .5rem;
`

const TableContainer = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;
  border-bottom: 1px solid #dee2e6;
`

const TableHead = styled.thead`
  text-align: left;
  border-bottom: 1px solid #dee2e6;

  th:nth-child(1) {
    width: 30%;
  }

  th:nth-child(4) {
    width: 20%;
  }
`

const TableBody = styled.tbody`
  tr:nth-child(odd) {
    background-color: #f1f3f5;
  }
`

const TableRow = styled.tr`
  height: 3.5rem;
`

export const TableHeadCell = styled.th`
  padding: .5rem 0;
  border-bottom: 1px solid #dee2e6;
`

export const TableBodyCell = styled.td`
  padding: .5rem 0;
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
          <TableBodyCell>
            <RowAction
              label={rowAction.label}
              rowData={{ data: row, variables }}
              onConfirm={handleRowActionConfirm}
              disabled={disabled}
            />
          </TableBodyCell>
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
    <DataTableContainer>
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
          <SpacerVertical />
        </>
      )}

      {body?.length > 0 ? (
        <>
          <TableContainer>
            <TableHead>
              <TableRow>
              {head}
              {rowAction && <TableHeadCell>Action</TableHeadCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {page.map(({ content, action }, i) => (
                <TableRow key={i}>
                  {content}
                  {rowAction && (action || <td />)}
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>
          <SpacerVertical />
          <Pagination
            current={pageIndex}
            total={body.length}
            size={PAGE_SIZE}
            onChange={setPageIndex}
          />
        </>
      ) : (
        emptyTableText
      )}
    </DataTableContainer>
  )
}

export default DataTable
