import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { RelayProvider } from './store/RelayProvider'

describe('App', () => {
  it('renders the demo route', () => {
    render(
      <MemoryRouter initialEntries={['/demo']}>
        <RelayProvider>
          <App />
        </RelayProvider>
      </MemoryRouter>,
    )

    expect(screen.getByLabelText('林然与小雨的同步视图')).toBeVisible()
  })
})
