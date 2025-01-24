import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Page from '../app/page'
import React from 'react';
import FSA from '../app/FSA';
import { CIRCLE_RADIUS } from '../app/components/Viewport';

// Extracts coordinates from style transform.
export function getCoords(string) {
  const match = string.match(/([-\d.]+)px,\s*([-\d.]+)px/);
  return [parseFloat(match[1]), parseFloat(match[2])];
}

let defaultMachine = new FSA();
const defaultSetter = jest.fn();
let user;

describe('Page', () => {

  beforeEach(() => {
    render(<Page />)
    user = userEvent.setup()
  });
  afterEach(() => defaultMachine = new FSA());

  describe('Start Up', () => {

    test('Viewport', () => {
      const viewport = screen.getByTestId("Viewport")
      expect(viewport).toBeInTheDocument()
    })
  })
  describe('Viewport', () => {

    test('Clicking inside viewport adds a state', async () => {
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { clientX: 100, clientY: 100 } });

      const stateCircle = screen.getByTestId("stateCircle");
      expect(stateCircle).toBeInTheDocument();
      expect(stateCircle.value).toBe('State 0');

      expect(getCoords(stateCircle.style.transform)[0]).toEqual(100 - CIRCLE_RADIUS / 2);
      expect(getCoords(stateCircle.style.transform)[1]).toEqual(100 - CIRCLE_RADIUS / 2);
      expect(stateCircle.value).toBe('State 0');
    })

    test('Clicking outside viewport does not add a state', async () => {
      const app = screen.getByTestId("App");
      await user.pointer({ keys: '[MouseLeft]', target: app, coords: { clientX: 0, clientY: 0 } });
      await user.pointer({ keys: '[MouseLeft]', target: app, coords: { clientX: 100, clientY: 100 } });
      await user.pointer({ keys: '[MouseLeft]', target: app, coords: { clientX: 1000, clientY: 1000 } });
      expect(screen.queryByTestId("stateCircle")).toBeNull();
    })

    test('INCOMPLETE - Cannot drag a state outside of the viewport', async () => {
      // const viewport = screen.getByTestId("Viewport")
      // await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });
      // const stateCircle = screen.getByRole("textbox");
      // const app = screen.getByTestId("App");
      // viewport.style.width = "200px";
      // viewport.style.height = "200px";

      // await user.pointer([
      //   { keys: '[MouseLeft>]', target: stateCircle }, 
      //   { target: viewport, coords: { x: 3000, y: 3000 } }, // Move by 3000 each way.
      //   { keys: '[/MouseLeft]' } 
      // ]);

      // expect(getCoords(stateCircle.style.transform)[0]).toEqual(200);
      // expect(getCoords(stateCircle.style.transform)[1]).toEqual(200);
    })
  })

  
  
})