import '@testing-library/jest-dom'
import { InteractionWindow } from '../app/components/InteractionWindow';

let user;
let defaultMachine = new FSA();
let circleArray = [];
let currentPositions = [];
const setMachine = jest.fn();
const setCircleArray = jest.fn();
const setCurrentPositions = jest.fn();
describe('InteractionWindow', () => {

    beforeEach(() => {
        user = userEvent.setup()
      });
      afterEach(() => defaultMachine = new FSA());
    describe('Initial Rendering', () => {
        test('Interaction Window', () => {
            render(<InteractionWindow  machine={defaultMachine} setMachine={setMachine} circleArray={} />)

        })
    })
})