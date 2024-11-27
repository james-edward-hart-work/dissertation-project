import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'
import React from 'react';

// // Mocked the useMouse function as Babel is unable to convert it into ES5 Javascript
jest.mock('@react-hook/mouse-position', () => ({
  __esModule: true,
  default: jest.fn(() => ({})), // Return a mock hook implementation
}));

 
describe('Page', () => {
  test('renders a heading', () => {
    render(<Page />)
 
    const heading = screen.getByRole('button')
 
    expect(heading).toBeInTheDocument()
  })
})