import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Pagination from '../Pagination'

describe('Pagination', () => {
  const customOnChange = jest.fn()

  afterEach(() => {
    customOnChange.mockClear()
  })

  it('renders page navigation buttons', () => {
    render(<Pagination onChange={customOnChange} current={1} total={85} />)

    const previousPageButton = screen.getByRole('button', {
      name: 'Go to previous page'
    })
    
    const nextPageButton = screen.getByRole('button', {
      name: 'Go to next page'
    })

    expect(previousPageButton).toBeInTheDocument()
    expect(nextPageButton).toBeInTheDocument()
  })

  it('navigates to the previous page', async () => {
    const user = userEvent.setup()

    const currentPage = 5
    render(<Pagination onChange={customOnChange} current={currentPage} total={85} />)

    await user.click(screen.getByRole('button', {
      name: 'Go to previous page'
    }))

    expect(customOnChange).toHaveBeenCalledTimes(1)
    expect(customOnChange).toHaveBeenCalledWith(currentPage - 1)
  })

  it('navigates to the next page', async () => {
    const user = userEvent.setup()

    const currentPage = 5
    render(<Pagination onChange={customOnChange} current={currentPage} total={85} />)

    await user.click(screen.getByRole('button', {
      name: 'Go to next page'
    }))

    expect(customOnChange).toHaveBeenCalledTimes(1)
    expect(customOnChange).toHaveBeenCalledWith(currentPage + 1)
  })

  describe('when in the first page', () => {
    it('calculates the correct range', () => {
      render(<Pagination onChange={customOnChange} current={1} total={85} />)

      expect(screen.getByText('1–10 of 85')).toBeInTheDocument()
    })

    it('has only the next button available', () => {
      render(<Pagination onChange={customOnChange} current={1} total={85} />)

      const previousPageButton = screen.getByRole('button', {
        name: 'Go to previous page'
      })
      
      const nextPageButton = screen.getByRole('button', {
        name: 'Go to next page'
      })

      expect(previousPageButton).toHaveAttribute('disabled')
      expect(nextPageButton).not.toHaveAttribute('disabled')
    })
  })

  describe('when in the middle of the available pages', () => {
    it('calculates the correct range', () => {
      render(<Pagination onChange={customOnChange} current={5} total={85} />)

      expect(screen.getByText('41–50 of 85')).toBeInTheDocument()
    })

    it('has both buttons enabled', () => {
      render(<Pagination onChange={customOnChange} current={5} total={85} />)

      const previousPageButton = screen.getByRole('button', {
        name: 'Go to previous page'
      })
      
      const nextPageButton = screen.getByRole('button', {
        name: 'Go to next page'
      })

      expect(previousPageButton).not.toHaveAttribute('disabled')
      expect(nextPageButton).not.toHaveAttribute('disabled')
    })
  })

  describe('when in the last page', () => {
    it('calculates the correct range', () => {
      render(<Pagination onChange={customOnChange} current={9} total={85} />)
      expect(screen.getByText('81–85 of 85')).toBeInTheDocument()
    })

    it('has only the previous button available', () => {
      render(<Pagination onChange={customOnChange} current={9} total={85} />)

      const previousPageButton = screen.getByRole('button', {
        name: 'Go to previous page'
      })
      
      const nextPageButton = screen.getByRole('button', {
        name: 'Go to next page'
      })

      expect(previousPageButton).not.toHaveAttribute('disabled')
      expect(nextPageButton).toHaveAttribute('disabled')
    })

  })

  describe('when only one page is available', () => {
    it('calculates the correct range', () => {
      render(<Pagination onChange={customOnChange} current={1} size={5} total={4} />)

      expect(screen.getByText('1–4 of 4')).toBeInTheDocument()
    })

    it('has both buttons disabled ', () => {
      render(<Pagination onChange={customOnChange} current={1} size={5} total={4} />)

      const previousPageButton = screen.getByRole('button', {
        name: 'Go to previous page'
      })
      
      const nextPageButton = screen.getByRole('button', {
        name: 'Go to next page'
      })

      expect(previousPageButton).toHaveAttribute('disabled')
      expect(nextPageButton).toHaveAttribute('disabled')
    })

  })

  describe('when total is 0', () => {
    it('does not show a label', () => {
      render(<Pagination onChange={customOnChange} current={9} total={0} />)

      expect(screen.queryByText(/(?:\d*\sof\s\d*$)/)).not.toBeInTheDocument()
    })

    it('has both buttons disabled ', () => {
      render(<Pagination onChange={customOnChange} current={1} size={5} total={4} />)

      const previousPageButton = screen.getByRole('button', {
        name: 'Go to previous page'
      })
      
      const nextPageButton = screen.getByRole('button', {
        name: 'Go to next page'
      })

      expect(previousPageButton).toHaveAttribute('disabled')
      expect(nextPageButton).toHaveAttribute('disabled')
    })
  })
})
