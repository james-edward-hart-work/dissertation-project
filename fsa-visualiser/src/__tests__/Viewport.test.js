import '@testing-library/jest-dom'
import { Viewport, CIRCLE_RADIUS } from '../app/components/Viewport';
import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react';
import FSA from '../app/FSA';
import { getCoords } from './page.test';
import { waitFor } from '@testing-library/react';
import { useState } from 'react';

let user;

describe('Viewport', () => {

  beforeEach(() => user = userEvent.setup());
  describe('States', () => {

    test('Initial render has no states', () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      expect(screen.queryByTestId("stateCircle")).toBeNull()

    })

    test('Click successfully creates a new state in FSA and viewport', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);

      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });

      const stateCircle = screen.getByTestId("stateCircle");
      expect(stateCircle).toBeInTheDocument();

      expect(getCoords(stateCircle.style.transform)[0]).toEqual(100 - CIRCLE_RADIUS / 2);
      expect(getCoords(stateCircle.style.transform)[1]).toEqual(100 - CIRCLE_RADIUS / 2);
      expect(screen.getByTestId('stateCircle').value).toBe('State 0');

    })

    test('Click on a state circle does not add a new state', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");

      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });

      const stateCircle = screen.getByTestId("stateCircle");
      expect(stateCircle).toBeInTheDocument();

      await user.pointer({ keys: '[MouseLeft]', target: stateCircle });
      const stateCircles = screen.getAllByTestId("stateCircle");
      expect(stateCircles.length).toEqual(1);

    })

    test('New states can be added after the first one', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");

      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });
      expect(screen.getAllByTestId("stateCircle").length).toEqual(1);

      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 200, y: 50 } });

      await waitFor(() => {
        expect(screen.getAllByTestId("stateCircle").length).toEqual(2);
      });

      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 400, y: 1 } });
      expect(screen.getAllByTestId("stateCircle").length).toEqual(3);

      const stateCircle = screen.getAllByTestId("stateCircle");
      expect(stateCircle.length).toEqual(3);
    })

    test('State names can be changed by typing within their circle', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      const stateCircle = screen.getByTestId("stateCircle");

      fireEvent.change(stateCircle, { target: { value: 'start_state' } })

      expect(stateCircle.value).toBe('start_state')
    })

    test('Alt+Click deletes the correct state from machine and viewport', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");

      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 200, y: 50 } });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 400, y: 1 } });
      expect(screen.getAllByTestId("stateCircle").length).toEqual(3);

      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: screen.getAllByTestId("stateCircle")[1] });
      await user.keyboard('{/Alt}');
      expect(screen.getAllByTestId("stateCircle").length).toEqual(2);

      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: screen.getAllByTestId("stateCircle")[0] });
      await user.keyboard('{/Alt}');
      expect(screen.getAllByTestId("stateCircle")[0].id).toBe("2");
      expect(screen.getAllByTestId("stateCircle").length).toEqual(1);
    })

    test('A new state may be added in the coordinates of a recently deleted state', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });
      expect(screen.getAllByTestId("stateCircle").length).toEqual(1);

      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: screen.getByTestId("stateCircle") });
      await user.keyboard('{/Alt}');
      expect(screen.queryByTestId("stateCircle")).toBeNull();

      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });
      expect(screen.getAllByTestId("stateCircle").length).toEqual(1);

    })

    test('Machine and viewport are unaffected if Alt+Click on blank space', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });
      await user.keyboard('{/Alt}');
      expect(screen.queryByTestId("stateCircle")).toBeNull()
    })

    test('Double Click Toggles Accept', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);

      await user.pointer({ keys: '[MouseLeft]', target: screen.getByTestId("Viewport"), coords: { x: 100, y: 100 } });

      const stateCircle = screen.getByTestId("stateCircle");
      expect(stateCircle.style.outline).toEqual("none");

      await user.dblClick(stateCircle)
      expect(stateCircle.style.outline).toEqual("1.5px solid black");

      await user.dblClick(stateCircle)
      expect(stateCircle.style.outline).toEqual("none");
    })
  })

  describe('State Movement', () => {

    test('Click + Drag on state moves state to correct coordinates', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);

      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });
      const stateCircle = screen.getByTestId("stateCircle");

      expect(getCoords(stateCircle.style.transform)[0]).toEqual(100 - CIRCLE_RADIUS / 2);
      expect(getCoords(stateCircle.style.transform)[1]).toEqual(100 - CIRCLE_RADIUS / 2);

      await user.pointer([
        { keys: '[MouseLeft>]', target: stateCircle },
        { target: stateCircle, coords: { clientX: 300, clientY: 300 } },
        { keys: '[/MouseLeft]' }
      ]);

      expect(getCoords(stateCircle.style.transform)[0]).toEqual(300 - CIRCLE_RADIUS / 2);
      expect(getCoords(stateCircle.style.transform)[1]).toEqual(300 - CIRCLE_RADIUS / 2);
      expect(screen.getAllByTestId("stateCircle").length).toEqual(1);
    })

    test('New state may be added in the coordinates of a dragged deleted state', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);

      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });
      const stateCircle = screen.getByTestId("stateCircle");
      expect(screen.getAllByTestId("stateCircle").length).toEqual(1);

      await user.pointer([
        { keys: '[MouseLeft>]', target: stateCircle },
        { target: stateCircle, coords: { clientX: 200, clientY: 200 } },
        { keys: '[/MouseLeft]' }
      ]);

      // Delete
      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle });
      await user.keyboard('{/Alt}');
      expect(screen.queryByTestId("stateCircle")).toBeNull();

      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 300, y: 300 } });
      expect(screen.getAllByTestId("stateCircle").length).toEqual(2);
    })

    test('Click + Drag on state does not move other state', async () => {
      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);

      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 0, y: 0 } });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 } });
      const stateCircle = screen.getAllByTestId("stateCircle");
      const state2Coords = getCoords(stateCircle[1].style.transform);

      await user.pointer([
        { keys: '[MouseLeft>]', target: stateCircle[0] },
        { target: stateCircle[0], coords: { clientX: 400, clientY: 400 } },
        { keys: '[/MouseLeft]' }
      ]);

      expect(getCoords(stateCircle[0].style.transform)[0]).toEqual(300 - CIRCLE_RADIUS / 2);
      expect(getCoords(stateCircle[0].style.transform)[1]).toEqual(300 - CIRCLE_RADIUS / 2);
      expect(getCoords(stateCircle[1].style.transform)).toEqual(state2Coords);
      expect(screen.getAllByTestId("stateCircle").length).toEqual(2);
    })
  })

  describe('Transitions', () => {
    
  })

})