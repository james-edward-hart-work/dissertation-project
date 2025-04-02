import '@testing-library/jest-dom'
import FSA from '../app/FSA';
import { InteractionWindow } from '../app/components/InteractionWindow';
import { userEvent } from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

/**
 * @jest-environment jsdom
 */

let user;
let defaultMachine = new FSA(0);
let testMachine = new FSA({
    startStateId: "0",
    states:
        [{ id: "0", name: "Start_State", transitions: [["a", "1"], ["b", "0"]], accept: false },
        { id: "1", name: "State1", transitions: [["a", "0"], ["b", "1"]], accept: true }],
    total: 2
});

// Test Suite for InteractionWindow.js
describe('InteractionWindow', () => {

    beforeEach(() => {
        user = userEvent.setup()
    });
    afterEach(() => defaultMachine = new FSA(0));
    describe('Initial Rendering', () => {
        test.each([
            ['InteractionWindow'],
            ['InputDiv'],
            ['WordInput'],
            ['PlayButton'],
            ['ValidLight'],
            ['OrganiseButton'],
            ['Dropdown'],
            ['ExportButton'],
            ['StatesButton'],
            ['ControlsButton'],
        ])('Render %s', (testId) => {
            render(<InteractionWindow machine={defaultMachine} />)
            expect(screen.getByTestId(testId)).toBeInTheDocument();
        });
    })

    describe('Conditional Rendering', () => {
        test('Red Light - Invalid FSA', () => {
            render(<InteractionWindow machine={defaultMachine} />)
            const viewport = screen.getByTestId("ValidLight")
            const style = window.getComputedStyle(viewport);
            expect(style.backgroundColor).toBe("red")
            expect(defaultMachine.status()).toEqual("Invalid");
        })
        test('Green Light - Valid FSA', () => {
            defaultMachine.addState("StartState");
            defaultMachine.addState("State1");
            render(<InteractionWindow machine={defaultMachine} />)
            const viewport = screen.getByTestId("ValidLight")
            const style = window.getComputedStyle(viewport);
            expect(style.backgroundColor).toBe("red")
            expect(defaultMachine.status()).toEqual("Invalid");
        })
        test('Toggling Controls', async () => {
            render(<InteractionWindow machine={defaultMachine} />)
            await user.click(screen.getByRole('button', { name: /View Hotkey Controls/i }));
            expect(screen.getByTestId("Controls")).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: /Hide Hotkey Controls/i }));
            expect(screen.queryByTestId("Controls")).toBeNull();
        })

        test('Toggling List of States - No States', async () => {
            render(<InteractionWindow machine={defaultMachine} />)
            await user.click(screen.getByRole('button', { name: /View Machine Description/i }));
            expect(screen.getByText("No States Added.")).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: /Hide Machine Description/i }));
            expect(screen.queryByText("No States Added.")).toBeNull();
        })

        test('Toggling List of States - States Added', async () => {
            render(<InteractionWindow machine={testMachine} />)
            await user.click(screen.getByRole('button', { name: /View Machine Description/i }));
            expect(screen.getByTestId("StatesList")).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: /Hide Machine Description/i }));
            expect(screen.queryByTestId("StatesList")).toBeNull();
        })
        test('Toggling List of States - States Added', async () => {
            render(<InteractionWindow machine={testMachine} />)
            await user.click(screen.getByRole('button', { name: /View Machine Description/i }));
            expect(screen.getByText("[a => State1]")).toBeInTheDocument();
            expect(screen.getByText("[b => Start_State]")).toBeInTheDocument();
            expect(screen.getByText("[a => Start_State]")).toBeInTheDocument();
            expect(screen.getByText("[b => State1]")).toBeInTheDocument();
        })

        test('Play/Stop Button Toggles Them', async () => {
            render(<InteractionWindow machine={defaultMachine} />)
            await user.click(screen.getByTestId('PlayButton'));
            expect(screen.getByTestId('PlayButton')).toBeInTheDocument();
        })
    })
})