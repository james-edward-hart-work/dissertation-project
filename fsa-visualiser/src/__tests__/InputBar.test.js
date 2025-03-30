import '@testing-library/jest-dom';
import FSA from "../app/FSA";
import { render, screen } from "@testing-library/react";
import { InputBar } from "../app/components/InputBar";
import { userEvent } from '@testing-library/user-event'

let validMachine = new FSA({
    startStateId: "0",
    states:
        [{ id: "0", name: "Start_State", transitions: [["a", "1"], ["b", "0"]], accept: false },
        { id: "1", name: "State1", transitions: [], accept: true }],
    total: 2
});

let deterministic = new FSA({
    startStateId: "0",
    states:
        [{ id: "0", name: "Start_State", transitions: [["a", "1"], ["b", "0"]], accept: false },
        { id: "1", name: "State1", transitions: [["a", "1"], ["b", "0"]], accept: true }],
    total: 2
});

let user;

beforeEach(() => user = userEvent.setup());

describe('InputBar', () => {
    test('InputBar Renders Correctly - Nondeterministic', () => {
        render(<InputBar machine={validMachine} />)
        expect(screen.getByText("Machine Type: Nondeterministic")).toBeInTheDocument();
        expect(screen.getByText("Machine's Input Alphabet: a, b")).toBeInTheDocument();
        const style = window.getComputedStyle(screen.getByTestId("ValidLight"));
        expect(style.backgroundColor).toBe("green")
    })

    test('InputBar Renders Correctly - Deterministic', () => {
        render(<InputBar machine={deterministic} />)
        expect(screen.getByText("Machine Type: Deterministic")).toBeInTheDocument();
        expect(screen.getByText("Machine's Input Alphabet: a, b")).toBeInTheDocument();
        const style = window.getComputedStyle(screen.getByTestId("ValidLight"));
        expect(style.backgroundColor).toBe("green")
    })

    test('InputBar Renders Correctly - Invalid', () => {
        render(<InputBar machine={new FSA(0)} />)
        expect(screen.getByText("Machine Type: Invalid")).toBeInTheDocument();
        expect(screen.getByText("Machine's Input Alphabet:")).toBeInTheDocument();
        const style = window.getComputedStyle(screen.getByTestId("ValidLight"));
        expect(style.backgroundColor).toBe("red")
    })

    test('Run Input Works', async () => {
        global.alert = jest.fn();
        render(<InputBar machine={validMachine} />)
        await user.click(screen.getByTestId("PlayButton"));
        expect(global.alert).toHaveBeenCalledWith('The machine rejects: ')

        await userEvent.type(screen.getByTestId('WordInput'), 'a')
        expect(screen.getByTestId('WordInput')).toHaveValue('a')
        await user.click(screen.getByTestId("PlayButton"));
        expect(global.alert).toHaveBeenCalledWith('The machine accepts: a.\nPath: Start_State => State1.')
    })
})