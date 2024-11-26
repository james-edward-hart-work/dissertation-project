import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'
import React from 'react';

// Mocked the useMouse function as Babel is unable to convert it into ES5 Javascript
jest.mock('@react-hook/mouse-position', () => ({
  useMouse: jest.fn()
}))
 
describe('Page', () => {
  test('renders a heading', () => {
    render(<Page />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})