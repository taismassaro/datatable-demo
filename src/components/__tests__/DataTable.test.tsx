import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { gql } from '@apollo/client'
import * as yup from 'yup'
import DataTable from '../DataTable'

function createTestWrapper (mocks: MockedResponse[]) {
  return function TestWrapper ({ children }: { children: React.ReactNode }) {
    return (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
    )
  }
}

const MOCK_QUERY = gql`query mockQuery { MockQuery { id } }`
const MOCK_MUTATION = gql`mutation mockMutation { MockMutation { id } }`
const initialDataMock = jest.fn(() => ({
  data: {
    MockQuery: {
      id: '1'
    }
  }
}))
const mutationResultMock = jest.fn(() => ({
  data: {
    MockMutation: {
      id: '1'
    }
  }
}))
const mocks = [
  {
    request: {
      query: MOCK_QUERY
    },
    result: initialDataMock
  },
  {
    request: {
      query: MOCK_MUTATION
    },
    result: mutationResultMock
  },
  {
    request: {
      query: MOCK_QUERY
    },
    result: initialDataMock
  }
]

const tableData = {
  head: (
    <>
      <th>first column header</th>
      <th>second column header</th>
    </>
  ),
  body: [
    {
      content: (
        <>
          <td>first row data</td>
          <td>second row data</td>
        </>
      ),
      rowActionParams: {
        show: true,
        variables: {
          merchantId: 'K01'
        }
      }
    }
  ]
}

describe('DataTable', () => {
  it('renders the table', async () => {
    render(
      <DataTable
        mapQueryToTableRows={() => tableData}
        queryGetItems={MOCK_QUERY}
        emptyTableText='table is empty'
        addRow={{
          buttonText: 'add button',
          mutation: MOCK_MUTATION,
          variables: {}
        }}
      />,
      { wrapper: createTestWrapper(mocks) }
    )

    expect(await screen.findByText('first column header')).toBeInTheDocument()
  })

  it('renders the empty-state if query returns no data', async () => {
    render(
      <DataTable
        mapQueryToTableRows={() => ({ head: {}, body: [] })}
        queryGetItems={MOCK_QUERY}
        emptyTableText='table is empty'
        addRow={{
          buttonText: 'add button',
          mutation: MOCK_MUTATION,
          variables: {}
        }}
      />,
      { wrapper: createTestWrapper(mocks) }
    )

    expect(await screen.findByText('table is empty')).toBeInTheDocument()
  })

  it('runs query for initial data on first render', async () => {
    render(
      <DataTable
        mapQueryToTableRows={jest.fn(() => tableData)}
        queryGetItems={MOCK_QUERY}
        emptyTableText='table is empty'
        addRow={{
          buttonText: 'add button',
          mutation: MOCK_MUTATION,
          variables: {}
        }}
      />,
      { wrapper: createTestWrapper(mocks) }
    )

    await waitFor(() => {
      expect(initialDataMock).toHaveBeenCalled()
    })
  })

  it('renders the query data as table rows', async () => {
    const mapQueryToTableRows = jest.fn(() => tableData)

    render(
      <DataTable
        mapQueryToTableRows={mapQueryToTableRows}
        queryGetItems={MOCK_QUERY}
        emptyTableText='table is empty'
        addRow={{
          buttonText: 'add button',
          mutation: MOCK_MUTATION,
          variables: {}
        }}
      />,
      { wrapper: createTestWrapper(mocks) }
    )

    await waitFor(() => {
      expect(mapQueryToTableRows).toHaveBeenCalled()
      expect(screen.getByText('first row data')).toBeInTheDocument()
    })
  })

  describe('when adding a row', () => {
    it('runs mutation on submit', async () => {
      render(
        <DataTable
          mapQueryToTableRows={jest.fn(() => tableData)}
          queryGetItems={MOCK_QUERY}
          emptyTableText='table is empty'
          addRow={{
            buttonText: 'add button',
            mutation: MOCK_MUTATION,
            variables: {}
          }}
        />,
        { wrapper: createTestWrapper(mocks) }
      )

      await screen.findByRole('button', { name: 'add button' })

      fireEvent.click(screen.getByRole('button', { name: 'add button' }))

      await waitFor(() => {
        expect(mutationResultMock).toHaveBeenCalled()
      })
    })

    it('shows error message if mutation fails', async () => {
      const mocksWithError = [
        {
          request: {
            query: MOCK_QUERY
          },
          result: initialDataMock
        },
        {
          request: {
            query: MOCK_MUTATION
          },
          error: new Error('An error occurred')
        }
      ]

      render(
        <DataTable
          mapQueryToTableRows={jest.fn(() => tableData)}
          queryGetItems={MOCK_QUERY}
          emptyTableText='table is empty'
          addRow={{
            buttonText: 'add button',
            mutation: MOCK_MUTATION,
            variables: {}
          }}
        />,
        { wrapper: createTestWrapper(mocksWithError) }
      )

      await screen.findByRole('button', { name: 'add button' })

      fireEvent.click(screen.getByRole('button', { name: 'add button' }))

      expect(await screen.findByText(/An error occurred/)).toBeInTheDocument()
    })

    describe('validation', () => {
      it('runs validation on submit and shows error', async () => {
        const invalidTableData = {
          ...tableData,
          validationData: { one: 'invalid' }
        }

        render(
          <DataTable
            mapQueryToTableRows={jest.fn(() => invalidTableData)}
            queryGetItems={MOCK_QUERY}
            emptyTableText='table is empty'
            addRow={{
              validationSchema: yup.object().shape({ one: yup.string().equals(['valid'], 'this is an error') }),
              buttonText: 'add button',
              mutation: MOCK_MUTATION,
              variables: {}
            }}
          />,
          { wrapper: createTestWrapper(mocks) }
        )

        await screen.findByRole('button', { name: 'add button' })

        fireEvent.click(screen.getByRole('button', { name: 'add button' }))

        expect(await screen.findByText('this is an error')).toBeInTheDocument()
      })
    })
  })

  describe('when there is a row action', () => {
    const rowActionMock = jest.fn()

    it('runs mutation on submit', async () => {
      render(
        <DataTable
          mapQueryToTableRows={jest.fn(() => tableData)}
          queryGetItems={MOCK_QUERY}
          emptyTableText='table is empty'
          rowAction={{
            label: 'Row action',
            action: rowActionMock
          }}
        />,
        { wrapper: createTestWrapper(mocks) }
      )
      await screen.findByText(/Row action/)

      fireEvent.click(screen.getByText(/Row action/))

      await waitFor(() => {
        expect(rowActionMock).toHaveBeenCalled()
      })
    })
  })
})
