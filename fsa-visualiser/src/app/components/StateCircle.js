import styles from "../../styles/Viewport.module.css"
import { useState, useRef } from "react"
import FSA from "../FSA";
import PropTypes from 'prop-types';
import Draggable from 'react-draggable'; // https://www.npmjs.com/package/react-draggable
import { useXarrow } from "react-xarrows";

/**
 * Function component for a state circle in the viewport.
 * @param machine Application's FSA
 * @param setMachine Setter for FSA
 * @param id of state
 * @param circleX coordinate
 * @param circleY coordinate
 * @param CIRCLE_RADIUS in pixels
 * @returns JSX for a state circle
 */
export const StateCircle = ({ setMachine, id, circleX, circleY, CIRCLE_RADIUS, updatePosition }) => {
    const [isAccept, setIsAccept] = useState(false);
    const ref = useRef(id);
    const updateXarrow = useXarrow();

    function handleDoubleClick(event) {
        if (event.shiftKey) {
            setMachine((machine) => {
                const newMachine = new FSA(machine);
                newMachine.setStartState(id);
                return newMachine;
            });
        } else {
            setIsAccept(!isAccept);
            setMachine((machine) => {
                const newMachine = new FSA(machine);
                newMachine.toggleAccept(id);
                return newMachine;
            });
        }
    }

    // Places circular text input inside a draggable div.
    return <Draggable
        nodeRef={ref}
        bounds="parent"
        key={id}
        defaultPosition={{ x: circleX, y: circleY }}
        onDrag={(data) => {
            updatePosition(id, data.x, data.y)
            updateXarrow();
        }}
        onStop={updateXarrow}
    >
        <input data-testid={"stateCircle"}
            ref={ref}
            id={id}
            className={styles.stateInput}
            type="text"
            defaultValue={"State " + id}
            onChange={(e) => {
                setMachine((machine) => {
                    const newMachine = new FSA(machine);
                    newMachine.updateStateName(id, e.target.value);
                    return newMachine;
                });
            }}

            style={isAccept
                ? { height: CIRCLE_RADIUS, width: CIRCLE_RADIUS, textAlign: "center", outline: "1.5px solid black", outlineOffset: "-10px" }
                : { height: CIRCLE_RADIUS, width: CIRCLE_RADIUS, textAlign: "center", outline: "none" }}
            onDoubleClick={(e) => handleDoubleClick(e)} />

    </Draggable >
}

StateCircle.propTypes = {
    id: PropTypes.string
};