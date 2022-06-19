import { QueryHookOptions } from '@apollo/client'
import { DocumentNode } from 'graphql'
import { ObjectSchema } from 'yup'

// DataTable

interface TableData {
  head: any
  body: any[]
  validationData?: Record<string, any>
}

interface AddRowProps {
  buttonText: string
  validationSchema?: ObjectSchema // yup schema
  mutation: DocumentNode // graphql mutation to add item
  variables?: Record<string, any>
}

interface RowActionProps {
  label: string
  loading?: boolean
  action: (args: any) => void // function to be called by row action
}

export interface DataTableProps {
  queryGetItems: DocumentNode // graphql query to fetch table items
  queryVariables?: Record<string, any>
  emptyTableText: string
  addRow?: AddRowProps
  rowAction?: RowActionProps // e.g. disable or delete
  mapQueryToTableRows: (queryResult: any) => TableData,
  additionalQueryOptions?: QueryHookOptions
}

// AddRowButton

export interface AddRowComponentProps {
  buttonText: string
  validationData?: Record<string, any>
  validationSchema?: ObjectSchema
  error: string
  setError: (error: string) => void
  refetchQuery: DocumentNode
  queryVariables?: Record<string, any>
  mutation: DocumentNode
  mutationVariables?: Record<string, any>
}

// RowActionButton

interface RowData {
  data: Record<string, string>
  variables: Record<string, string>
}

export interface RowActionComponentProps {
  label: string
  rowData: RowData
  onConfirm: ({ variables }: { variables: Record<string, string>}) => void
  disabled: boolean
}

// Pagination

export interface PaginationProps {
  onChange?: (page: number) => void
  current: number
  size?: number
  total: number
}
