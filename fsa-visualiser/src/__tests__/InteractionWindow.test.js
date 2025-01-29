import '@testing-library/jest-dom'
import FSA from '../app/FSA';
import { InteractionWindow } from '../app/components/InteractionWindow';
import { userEvent } from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

let user;
let defaultMachine = new FSA();
let circleArray = [];
let currentPositions = [];
const setMachine = jest.fn();
const setCircleArray = jest.fn();
const setCurrentPositions = jest.fn();
let testMachine = new FSA();
testMachine.states = [{ id: 0, name: "Start_State", transitions: [["a", 1], ["b", 0]], accept: false },
{ id: 1, name: "State1", transitions: [["a", 0], ["b", 1]], accept: true }];
testMachine.total = 2;

describe('InteractionWindow', () => {

    beforeEach(() => {
        user = userEvent.setup()
    });
    afterEach(() => defaultMachine = new FSA());
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
            render(<InteractionWindow machine={defaultMachine} setMachine={setMachine} circleArray={circleArray} setCircleArray={setCircleArray} currentPositions={currentPositions} setCurrentPositions={setCurrentPositions} />)
            expect(screen.getByTestId(testId)).toBeInTheDocument();
        });
    })

    describe('Conditional Rendering', () => {
        test('Red Light - Invalid FSA', () => {
            render(<InteractionWindow machine={defaultMachine} setMachine={setMachine} circleArray={circleArray} setCircleArray={setCircleArray} currentPositions={currentPositions} setCurrentPositions={setCurrentPositions} />)
            const viewport = screen.getByTestId("ValidLight")
            const style = window.getComputedStyle(viewport);
            expect(style.backgroundColor).toBe("red")
            expect(defaultMachine.isValid()).toBeFalsy();
        })
        test('Green Light - Valid FSA', () => {
            defaultMachine.addState("StartState");
            defaultMachine.addState("State1");
            render(<InteractionWindow machine={defaultMachine} setMachine={setMachine} circleArray={circleArray} setCircleArray={setCircleArray} currentPositions={currentPositions} setCurrentPositions={setCurrentPositions} />)
            const viewport = screen.getByTestId("ValidLight")
            const style = window.getComputedStyle(viewport);
            expect(style.backgroundColor).toBe("green")
            expect(defaultMachine.isValid()).toBeTruthy();
        })
        test('Toggling Controls', async () => {
            render(<InteractionWindow machine={defaultMachine} setMachine={setMachine} circleArray={circleArray} setCircleArray={setCircleArray} currentPositions={currentPositions} setCurrentPositions={setCurrentPositions} />)
            await user.click(screen.getByRole('button', { name: /View Controls/i }));
            expect(screen.getByTestId("Controls")).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: /Hide Controls/i }));
            expect(screen.queryByTestId("Controls")).toBeNull();
        })

        test('Toggling List of States - No States', async () => {
            render(<InteractionWindow machine={defaultMachine} setMachine={setMachine} circleArray={circleArray} setCircleArray={setCircleArray} currentPositions={currentPositions} setCurrentPositions={setCurrentPositions} />)
            await user.click(screen.getByRole('button', { name: /View States/i }));
            expect(screen.getByText("No States Added.")).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: /Hide States/i }));
            expect(screen.queryByText("No States Added.")).toBeNull();
        })

        test('Toggling List of States - States Added', async () => {
            render(<InteractionWindow machine={testMachine} setMachine={setMachine} circleArray={circleArray} setCircleArray={setCircleArray} currentPositions={currentPositions} setCurrentPositions={setCurrentPositions} />)
            await user.click(screen.getByRole('button', { name: /View States/i }));
            expect(screen.getByTestId("StatesList")).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: /Hide States/i }));
            expect(screen.queryByTestId("StatesList")).toBeNull();
        })
        test('Toggling List of States - States Added', async () => {
            render(<InteractionWindow machine={testMachine} setMachine={setMachine} circleArray={circleArray} setCircleArray={setCircleArray} currentPositions={currentPositions} setCurrentPositions={setCurrentPositions} />)
            await user.click(screen.getByRole('button', { name: /View States/i }));
            expect(screen.getByText("[a => 1]")).toBeInTheDocument();
            expect(screen.getByText("[b => 0]")).toBeInTheDocument();
            expect(screen.getByText("[a => 0]")).toBeInTheDocument();
            expect(screen.getByText("[b => 1]")).toBeInTheDocument();
        })

        test('Export Button shows alert - None', async () => {
            global.alert = jest.fn();
            render(<InteractionWindow machine={defaultMachine} setMachine={setMachine} circleArray={circleArray} setCircleArray={setCircleArray} currentPositions={currentPositions} setCurrentPositions={setCurrentPositions} />)
            await user.click(screen.getByRole('button', { name: /Export/i }));
            expect(global.alert).toHaveBeenCalledWith('Exported: None')
        })

        test.each([
            ['PNG'],
            ['SVG'],
            ['LaTeX'],
            ['Video'],
        ])('Export Type: %s', async (type) => {
            global.alert = jest.fn();
            render(<InteractionWindow machine={defaultMachine} setMachine={setMachine} circleArray={circleArray} setCircleArray={setCircleArray} currentPositions={currentPositions} setCurrentPositions={setCurrentPositions} />)
            // Test taken from: https://cathalmacdonnacha.com/how-to-test-a-select-element-with-react-testing-library
            userEvent.selectOptions(
                screen.getByTestId('Select'),
                screen.getByRole('option', { name: type }),
            )
            // End of copied code.
            await user.click(screen.getByRole('button', { name: /Export/i }));
            expect(global.alert).toHaveBeenCalledWith('Exported: ' + type)
        });

        test('Play/Stop Button Toggles Them', async () => {
            render(<InteractionWindow machine={defaultMachine} setMachine={setMachine} circleArray={circleArray} setCircleArray={setCircleArray} currentPositions={currentPositions} setCurrentPositions={setCurrentPositions} />)
            await user.click(screen.getByTestId('PlayButton'));
            expect(screen.getByTestId('StopButton')).toBeInTheDocument();
            await user.click(screen.getByTestId('StopButton'));
            expect(screen.getByTestId('PlayButton')).toBeInTheDocument();
        })
    })
})