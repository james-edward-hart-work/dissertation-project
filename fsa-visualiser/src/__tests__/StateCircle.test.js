import { StateCircle } from "../app/components/StateCircle";
import { CIRCLE_RADIUS } from "../app/components/Viewport";

describe('StateCircle', () => {

    test('Double Click Toggles Accept', async () => {
        const Wrapper = async () => {
            const [defaultMachine, machineSetter] = useState(new FSA(0));
            render(<StateCircle setMachine={machineSetter} id={0} circleX={0} circleY={0} CIRCLE_RADIUS={CIRCLE_RADIUS} />)

            await user.dblclick(screen.getByTestId("stateCircle"))
            expect(defaultMachine.states[0].accept).toBeTruthy();
            expect(machineSetter).toHaveBeenCalledWith("")
        };
    })
})
