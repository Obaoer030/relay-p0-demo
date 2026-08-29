import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { WorkspaceProvider } from './workspace/WorkspaceProvider'

describe('App', () => {
  it('renders the demo route', () => {
    render(
      <MemoryRouter initialEntries={['/demo']}>
        <WorkspaceProvider>
          <App />
        </WorkspaceProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
  })
})
