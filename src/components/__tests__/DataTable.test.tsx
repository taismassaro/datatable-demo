import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { gql } from '@apollo/client'
import * as yup from 'yup'
import { DesignVersionProvider, ParticleDesignVersions } from 'mage-deps/@klarna/bubble-ui'
import { HeaderTextCell, BodyTextCell } from 'mage-deps/@klarna/mp-ui'
import { DataTable } from '../DataTable'

function createTestWrapper (mocks) {
  return function TestWrapper ({ children }) {
    return (
      <DesignVersionProvider value={ParticleDesignVersions.NEXT}>
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      </DesignVersionProvider>
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
      <HeaderTextCell>first column header</HeaderTextCell>
      <HeaderTextCell>second column header</HeaderTextCell>
    </>
  ),
  body: [
    {
      content: (
        <>
          <BodyTextCell>first row data</BodyTextCell>
          <BodyTextCell>second row data</BodyTextCell>
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

    describe('with modals', () => {
      it('shows confirmation modal on click', async () => {
        render(
          <DataTable
            mapQueryToTableRows={jest.fn(() => tableData)}
            queryGetItems={MOCK_QUERY}
            emptyTableText='table is empty'
            addRow={{
              buttonText: 'add button',
              mutation: MOCK_MUTATION,
              variables: {},
              confirmationModalProps: {
                title: 'Please confirm',
                confirmButtonText: 'Confirm'
              }
            }}
          />,
          { wrapper: createTestWrapper(mocks) }
        )

        await screen.findByRole('button', { name: 'add button' })

        fireEvent.click(screen.getByRole('button', { name: 'add button' }))

        expect(await screen.findByText(/Please confirm/)).toBeInTheDocument()
      })

      it('calls mutation on modal submit', async () => {
        render(
          <DataTable
            mapQueryToTableRows={jest.fn(() => tableData)}
            queryGetItems={MOCK_QUERY}
            emptyTableText='table is empty'
            addRow={{
              buttonText: 'add button',
              mutation: MOCK_MUTATION,
              variables: {},
              confirmationModalProps: {
                title: 'Please confirm',
                confirmButtonText: 'Confirm'
              }
            }}
          />,
          { wrapper: createTestWrapper(mocks) }
        )

        await screen.findByRole('button', { name: 'add button' })

        fireEvent.click(screen.getByRole('button', { name: 'add button' }))

        await screen.findByText(/Please confirm/)

        fireEvent.click(screen.getByRole('button', { name: /Confirm/ }))

        await waitFor(() => {
          expect(mutationResultMock).toHaveBeenCalled()
        })
      })

      it('shows success modal, passing the data returned by mutation', async () => {
        render(
          <DataTable
            mapQueryToTableRows={jest.fn(() => tableData)}
            queryGetItems={MOCK_QUERY}
            emptyTableText='table is empty'
            addRow={{
              buttonText: 'add button',
              mutation: MOCK_MUTATION,
              variables: {},
              // eslint-disable-next-line react/display-name
              SuccessModal: () => (<div>it worked!</div>)
            }}
          />,
          { wrapper: createTestWrapper(mocks) }
        )

        await screen.findByRole('button', { name: 'add button' })

        fireEvent.click(screen.getByRole('button', { name: 'add button' }))

        expect(await screen.findByText('it worked!')).toBeInTheDocument()
      })
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

    describe('with confirmation modal', () => {
      it('shows confirmation modal on click', async () => {
        render(
          <DataTable
            mapQueryToTableRows={jest.fn(() => tableData)}
            queryGetItems={MOCK_QUERY}
            emptyTableText='table is empty'
            rowAction={{
              label: 'Row action',
              action: () => ({}),
              confirmationModalProps: {
                title: 'Confirmation modal',
                confirmButtonText: 'Confirm',
                // eslint-disable-next-line react/display-name
                content: () => (
                  <div>Please confirm this row action</div>
                )
              }
            }}
          />,
          { wrapper: createTestWrapper(mocks) }
        )

        await screen.findByText(/Row action/)

        fireEvent.click(screen.getByText(/Row action/))

        expect(await screen.findByText(/Please confirm this row action/)).toBeInTheDocument()
      })

      it('calls mutation on modal submit', async () => {
        render(
          <DataTable
            mapQueryToTableRows={jest.fn(() => tableData)}
            queryGetItems={MOCK_QUERY}
            emptyTableText='table is empty'
            rowAction={{
              label: 'Row action',
              action: () => ({}),
              confirmationModalProps: {
                title: 'Confirmation modal',
                confirmButtonText: 'Confirm',
                // eslint-disable-next-line react/display-name
                content: () => (
                  <div>Please confirm this row action</div>
                )
              }
            }}
          />,
          { wrapper: createTestWrapper(mocks) }
        )

        await screen.findByText('Row action')

        fireEvent.click(screen.getByText('Row action'))

        await screen.findByText('Please confirm this row action')

        fireEvent.click(screen.getByRole('button', { name: /Confirm/ }))

        await waitFor(() => {
          expect(rowActionMock).toHaveBeenCalled()
        })
      })
    })
  })
})
