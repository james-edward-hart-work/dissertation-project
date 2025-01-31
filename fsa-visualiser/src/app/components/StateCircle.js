import styles from "../../styles/Viewport.module.css"
import { useState, useRef } from "react"
import PropTypes from 'prop-types';
import Draggable from 'react-draggable'; // https://www.npmjs.com/package/react-draggable

/**
 * Function component for a state circle in the viewport.
 * @param machine Application's FSA
 * @param setMachine Setter for FSA
 * @param id of state
 * @param circleX coordinate
 * @param circleY coordinate
 * @param CIRCLE_RADIUS in pixels
 * @param updatePosition function to update circle's position
 * @returns JSX for a state circle
 */
export const StateCircle = ({ machine, setMachine, id, circleX, circleY, CIRCLE_RADIUS }) => {
    const [isAccept, setIsAccept] = useState(false);
    const ref = useRef(id);

    function handleDoubleClick(event) {
        if (event.shiftKey) {
            setMachine(machine.setStartState(id));
        } else {
            setIsAccept(!isAccept);
            machine.toggleAccept(id);
        }
    }

    // Places circular text input inside a draggable div.
    return <Draggable
        nodeRef={ref}
        bounds="parent"
        key={id}
        defaultPosition={{ x: circleX, y: circleY }} >
        {isAccept
            ? <input data-testid={"stateCircle"}
                ref={ref}
                id={id}
                className={styles.stateInput}
                type="text"
                defaultValue={"State " + id}
                onChange={(e) => { setMachine(machine.updateStateName(id, e.target.value)) }}
                style={{ height: CIRCLE_RADIUS, width: CIRCLE_RADIUS, textAlign: "center", outline: "1.5px solid black", outlineOffset: "-10px" }}
                onDoubleClick={(e) => handleDoubleClick(e)} />
            : <input data-testid={"stateCircle"}
                ref={ref}
                id={id}
                className={styles.stateInput}
                type="text"
                defaultValue={"State " + id}
                onChange={(e) => { setMachine(machine.updateStateName(id, e.target.value)) }}
                style={{ height: CIRCLE_RADIUS, width: CIRCLE_RADIUS, textAlign: "center", outline: "none" }}
                onDoubleClick={(e) => handleDoubleClick(e)}
            />}

    </Draggable >
}

StateCircle.propTypes = {
    id: PropTypes.number
};