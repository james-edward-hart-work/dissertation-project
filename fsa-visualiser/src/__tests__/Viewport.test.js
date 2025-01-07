import '@testing-library/jest-dom'
import { Viewport } from '../app/components/Viewport';
import { render, screen } from '@testing-library/react'
import React from 'react';

// Mocked the useMouse function as Babel is unable to convert it into ES5 Javascript
jest.mock('@react-hook/mouse-position', () => ({
  __esModule: true,
  default: jest.fn(() => ({})), // Return a mock hook implementation
}));

// Tests: 
// Click - add state (data-testid=stateCircle)
// Click on circle does not add state 
// Drag moves circle to correct position
// Cannot Drag outside of boundaries
// Name Change for states
// Can delete state properly and affects FSA
 
describe('Viewport', () => {
  test('Renders the viewport', () => {
    render(<Viewport />)
 
    const viewport = screen.getByTestId("Viewport")
 
    expect(viewport).toBeInTheDocument()
  })
})