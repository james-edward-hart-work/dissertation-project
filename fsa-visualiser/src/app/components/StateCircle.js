import styles from "../../styles/Viewport.module.css"
import { useState, useRef, useEffect } from "react"
import FSA from "../FSA";
import PropTypes from 'prop-types';
import Draggable from 'react-draggable'; // https://www.npmjs.com/package/react-draggable
import { useXarrow } from "react-xarrows"; // https://www.npmjs.com/package/react-xarrows/v/1.7.0 

/**
 * Function component for a state circle in the viewport.
 * @param setMachine Setter for application's FSA
 * @param id of state
 * @param defaultX coordinate
 * @param defaultY coordinate
 * @param CIRCLE_RADIUS in pixels
 * @param fixedPosition fixed position when organised
 * @param isAccept Boolean for whether the state is an accept state or not
 * @returns JSX for a state circle
 */
export const StateCircle = ({ setMachine, id, defaultX, defaultY, CIRCLE_RADIUS, fixedPosition, isAccept }) => {
    const [positionState, setPositionState] = useState({ x: defaultX, y: defaultY });

    const ref = useRef(id);
    const updateXarrow = useXarrow(); // Function to update connected transition arrows.

    // Set position state if incoming position is not null.
    useEffect(() => {
        setPositionState(fixedPosition);
    }, [fixedPosition]);

    // Places circular text input inside a draggable div.
    return <Draggable
        nodeRef={ref}
        bounds="parent"
        key={id}
        position={positionState}
        onDrag={(e, data) => {
            updateXarrow();
            setPositionState({ x: data.x, y: data.y })
        }}
        onStop={updateXarrow}>

        <input data-testid={"stateCircle"}
            ref={ref}
            id={id}
            key={id}
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

            // Unhighlight upon hitting Enter key
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.target.blur();
                }
            }}

            // Adds an internal ring if the state is an accept state
            style={isAccept
                ? { height: CIRCLE_RADIUS, width: CIRCLE_RADIUS, textAlign: "center", outline: "1.5px solid black", outlineOffset: "-10px" }
                : { height: CIRCLE_RADIUS, width: CIRCLE_RADIUS, textAlign: "center", outline: "none" }}
            />

    </Draggable >
}

StateCircle.propTypes = {
    id: PropTypes.string
};