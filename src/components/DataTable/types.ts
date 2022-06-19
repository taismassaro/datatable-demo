import { DocumentNode } from 'graphql'
import { ObjectSchema } from 'yup'
import { QueryHookOptions } from '@apollo/client'

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
  // function to be called by row action
  action: (args: any) => void
}

export interface DataTableProps {
  queryGetItems: DocumentNode // graphql query
  queryVariables?: Record<string, any>
  emptyTableText: string
  addRow?: AddRowProps
  rowAction?: RowActionProps // e.g. disable or delete
  mapQueryToTableRows: (queryResult: any) => TableData,
  additionalQueryOptions?: QueryHookOptions
}

/* ------------------------------ AddRow ------------------------------ */

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

/* ----------------------------- RowAction ---------------------------- */

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
