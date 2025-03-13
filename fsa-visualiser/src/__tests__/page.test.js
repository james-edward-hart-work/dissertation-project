import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Page from '../app/page'
import React from 'react';
import FSA from '../app/FSA';
import { CIRCLE_RADIUS } from '../app/components/Viewport';
import * as htmlToImage from 'html-to-image';

// Extracts coordinates from style transform.
export function getCoords(string) {
  const match = string.match(/([-\d.]+)px,\s*([-\d.]+)px/);
  return [parseFloat(match[1]), parseFloat(match[2])];
}

let defaultMachine = new FSA(0);
let user;

describe('Page', () => {

  beforeEach(() => {
    render(<Page />)
    user = userEvent.setup()
  });
  afterEach(() => defaultMachine = new FSA(0));

  describe('Start Up', () => {

    test('Viewport', () => {
      const viewport = screen.getByTestId("Viewport")
      expect(viewport).toBeInTheDocument()
    })

    test('Interaction Window', () => {
      const viewport = screen.getByTestId("InteractionWindow")
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
  })

  // describe('Multiple Components', () => {

  //   beforeEach(() => {
  //     windowSpy = jest.spyOn(window, "window", "get");
  //   });
    
  //   afterEach(() => {
  //     windowSpy.mockRestore();
  //   });
  //   test.each([
  //     ['PNG'],
  //     ['SVG'],
  //     // ['JSON'],
  //     // ['LaTeX'],
  //     // ['Video'],
  //   ])('Export Type: %s', async (type) => {

  //     SVGElement.prototype.getTotalLength = () => 100;

  //     global.alert = jest.fn();
  //     global.confirm = jest.fn();


  //     const viewport = screen.getByTestId("Viewport");
  //     await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { clientX: 0, clientY: 0 } });
  //     await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { clientX: 100, clientY: 100 } });
  //     const stateCircle = screen.getAllByTestId("stateCircle");

  //     // Set accept state
  //     await user.dblClick(stateCircle[1])

  //     // Set Start state
  //     await user.keyboard('{Shift>}');
  //     await user.keyboard('{Alt>}');
  //     await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
  //     await user.keyboard('{/Alt}');
  //     await user.keyboard('{/Shift}');

  //     // Add transition
  //     await user.keyboard('{Shift>}');
  //     await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
  //     await user.keyboard('{/Shift}');
  //     await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });

  //     // Test adapted from: https://cathalmacdonnacha.com/how-to-test-a-select-element-with-react-testing-library
  //     userEvent.selectOptions(
  //       screen.getByTestId('Select'),
  //       screen.getByRole('option', { name: type }),
  //     )

  //     // const link = {
  //     //     click: jest.fn()
  //     // };

  //     const fileSpy = jest.spyOn(htmlToImage, "toPng");
  //     const spy = jest.spyOn(document, "createElement");

  //     await user.click(screen.getByTestId("ExportButton"));

  //     //expect(spy).toHaveBeenCalledWith('a');
  //     expect(fileSpy).toHaveBeenCalledTimes(1);

  //     //expect(link.download).toEqual("MyFSA." + type.toLowerCase());
  //   })
  // })
})