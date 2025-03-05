import '@testing-library/jest-dom'
import { Viewport, CIRCLE_RADIUS } from '../app/components/Viewport';
import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react';
import FSA from '../app/FSA';
import { getCoords } from './page.test';
import { waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe } from 'node:test';

// Contains the unit tests for graphical manipulation of the FSA, including: Viewport.js, StateCircle.js and TransitionArrow.js

let user;

describe('Viewport', () => {

  beforeEach(() => user = userEvent.setup());
  describe('States', () => {

    test('Initial render has no states', () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      expect(screen.queryByTestId("stateCircle")).toBeNull()

    })

    test('Click successfully creates a new state in FSA and viewport', async () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
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

    // Need to mock getTotalLength() as it does not exist within jest DOM
    beforeAll(() => {
      SVGElement.prototype.getTotalLength = () => 100;

      // Jest incorrectly marks startAnchor and endAnchor as invalid props to Xarrow
      // This spy0n reconfigures console.error to ignore those warnings
      jest.spyOn(console, 'error').mockImplementation((...args) => {

        const message = args.join(''); // Convert error message arguments to a string

        if (message.includes('Invalid prop `endAnchor` supplied to `Xarrow`')) {
          return;
        }
        if (message.includes('Invalid prop `startAnchor` supplied to `Xarrow`')) {
          return;
        }
        console.error(message); // Log all other messages
      });
    });

    test('Add transition between two states', async () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 300, y: 300 }, });
      const stateCircle = screen.getAllByTestId("stateCircle");
      expect(screen.queryByTestId("transitionArrow")).toBeNull();

      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });

      expect(screen.getAllByTestId("transitionInput").length).toEqual(1);
      expect(ref.current.states[0].transitions[0]).toEqual(["A", "1"]);
    })

    test('Add transition between the same state', async () => {

      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      const stateCircle = screen.getByTestId("stateCircle");
      expect(screen.queryByTestId("transitionArrow")).toBeNull();

      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle });
      await user.keyboard('{/Shift}');

      await user.pointer({ keys: '[MouseLeft]', target: stateCircle });

      expect(screen.getAllByTestId("transitionInput").length).toEqual(1);
      expect(ref.current.states[0].transitions[0]).toEqual(["A", "0"]);
    })

    test('Change transition input', async () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 300, y: 300 }, });
      const stateCircle = screen.getAllByTestId("stateCircle");

      // Two different states
      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });

      const transition = screen.getByTestId("transitionInput");
      expect(transition.value).toEqual("A");
      await userEvent.type(transition, '{backspace}')
      await userEvent.type(transition, 'b')
      expect(transition.value).toEqual("b");

      // To same state
      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });

      const transition2 = screen.getAllByTestId("transitionInput")[1];
      expect(transition2.value).toEqual("A");
      await userEvent.type(transition2, '{backspace}')
      await userEvent.type(transition2, 'ε')
      expect(transition2.value).toEqual("ε");
    })

    test('Delete transition between the same state', async () => {

      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      const stateCircle = screen.getByTestId("stateCircle");
      expect(screen.queryByTestId("transitionArrow")).toBeNull();

      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle });
      await user.keyboard('{/Shift}');

      await user.pointer({ keys: '[MouseLeft]', target: stateCircle });

      expect(screen.getAllByTestId("transitionInput").length).toEqual(1);
      const transition = screen.getByTestId("transitionInput");

      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: transition });
      await user.keyboard('{/Alt}');

      expect(screen.queryByTestId("transitionArrow")).toBeNull();
    })

    test('Delete transition between two states', async () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 300, y: 300 }, });
      const stateCircle = screen.getAllByTestId("stateCircle");
      expect(screen.queryByTestId("transitionArrow")).toBeNull();

      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });

      const transition = screen.getByTestId("transitionInput");

      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: transition });
      await user.keyboard('{/Alt}');

      expect(screen.queryByTestId("transitionArrow")).toBeNull();
    })

    test('Delete state with transitions from state', async () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 300, y: 300 }, });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 500, y: 500 }, });
      const stateCircle = screen.getAllByTestId("stateCircle");
      expect(screen.queryByTestId("transitionInput")).toBeNull();

      // Create transitions
      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });

      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[2] });

      expect(screen.queryAllByTestId("transitionInput").length).toEqual(2);

      // Between states that will not be deleted.
      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[2] });

      // Delete state
      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Alt}');

      expect(screen.queryAllByTestId("transitionInput").length).toEqual(1);
    })

    test('Delete state with transitions to state', async () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 300, y: 300 }, });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 500, y: 500 }, });
      const stateCircle = screen.getAllByTestId("stateCircle");
      expect(screen.queryByTestId("transitionInput")).toBeNull();

      // Create transitions
      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[2] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });

      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });

      // Between states that will not be deleted.
      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[2] });

      expect(screen.queryAllByTestId("transitionInput").length).toEqual(3);

      // Delete state
      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });
      await user.keyboard('{/Alt}');

      expect(screen.queryAllByTestId("transitionInput").length).toEqual(1);
    })

    test('Create transition from no origin or destination state', async () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");

      // No states to create transition from
      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      await user.keyboard('{/Shift}');

      expect(ref.current.states.length).toEqual(0);

      // No valid destination state.
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: screen.getByTestId('stateCircle') });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 500, y: 500 }, });

      expect(ref.current.states[0].transitions.length).toEqual(0);
    })

    test('Click toggles straightness of arrow', async () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 300, y: 300 }, });
      const stateCircle = screen.getAllByTestId("stateCircle");
      expect(screen.queryByTestId("transitionArrow")).toBeNull();

      await user.keyboard('{Shift>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Shift}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });

      expect(screen.getAllByTestId("transitionInput").length).toEqual(1);

      await user.pointer({ keys: '[MouseLeft]', target: screen.getByTestId("transitionInput") });
    })
  })

  describe('Start State', () => {

    beforeAll(() => {
      SVGElement.prototype.getTotalLength = () => 100;

      // Jest incorrectly marks startAnchor and endAnchor as invalid props to Xarrow
      // This spy0n reconfigures console.error to ignore those warnings
      jest.spyOn(console, 'error').mockImplementation((...args) => {

        const message = args.join(''); // Convert error message arguments to a string

        if (message.includes('Invalid prop `endAnchor` supplied to `Xarrow`')) {
          return;
        }
        if (message.includes('Invalid prop `startAnchor` supplied to `Xarrow`')) {
          return;
        }
        console.error(message); // Log all other messages
      });
    });
    test('Assign start state', async () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 300, y: 300 }, });
      const stateCircle = screen.getAllByTestId("stateCircle");
      expect(ref.current.startStateId).toEqual("-1");

      await user.keyboard('{Shift>}');
      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[0] });
      await user.keyboard('{/Alt}');
      await user.keyboard('{/Shift}');

      expect(screen.getByTestId("start")).toBeInTheDocument();
      expect(ref.current.startStateId).toEqual("0");

      // Reassign it
      await user.keyboard('{Shift>}');
      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle[1] });
      await user.keyboard('{/Alt}');
      await user.keyboard('{/Shift}');

      expect(screen.getByTestId("start")).toBeInTheDocument();
      expect(ref.current.startStateId).toEqual("1");
    })

    test('Delete start state', async () => {
      const ref = { current: null }; // Stores reference to machine in mock viewport.

      const Wrapper = () => {
        const [defaultMachine, machineSetter] = useState(new FSA(0));
        ref.current = defaultMachine; // Store defaultMachine in the ref for access outside Wrapper
        return <Viewport machine={defaultMachine} setMachine={machineSetter} />;
      };

      render(<Wrapper />);
      const viewport = screen.getByTestId("Viewport");
      await user.pointer({ keys: '[MouseLeft]', target: viewport, coords: { x: 100, y: 100 }, });
      const stateCircle = screen.getByTestId("stateCircle");
      expect(ref.current.startStateId).toEqual("-1");

      // Set to start state
      await user.keyboard('{Shift>}');
      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle });
      await user.keyboard('{/Alt}');
      await user.keyboard('{/Shift}');

      expect(screen.getByTestId("start")).toBeInTheDocument();
      expect(ref.current.startStateId).toEqual("0");

      // Delete start state
      await user.keyboard('{Alt>}');
      await user.pointer({ keys: '[MouseLeft]', target: stateCircle });
      await user.keyboard('{/Alt}');

      expect(screen.queryByTestId("start")).toBeNull();
      expect(ref.current.startStateId).toEqual("-1");
    })
  })
})