import { useEffect, useRef } from "react";
import FSA from "../FSA";
import PropTypes from 'prop-types';
import Xarrow from "react-xarrows"; // Imported from: https://www.npmjs.com/package/react-xarrows/v/1.7.0
import styles from "../../styles/TransitionArrow.module.css"

/**
 * Function component for a transition arrow
 * @param originStateId Id of origin state
 * @param destStateId Id of destination state
 * @param setMachine Function to update FSA
 * @param setTransitionArray Function to update array of transition arrows in Viewport
 * @returns JSX for transition arrow
 */
export const TransitionArrow = ({ originStateId, destStateId, setMachine, setTransitionArray }) => {

    // Highlight transition input label upon initial render
    const inputRef = useRef(null);
    useEffect(() => {
        setTimeout(() => { // Timeout to allow component to render
            inputRef.current?.focus();
        }, 0);
    }, []);

    /**
     * Handles a click on an arrow, if alt is pressed to it deletes the transition.
     * @param event prop
     */
    function handleClick(event) {
        if (event.altKey) { // Deletes transition
            setMachine((machine) => {
                const newMachine = new FSA(machine);
                newMachine.deleteTransition(originStateId, destStateId);
                return newMachine;
            });
            setTransitionArray(array => array.filter(arrow => (arrow.key != (originStateId + "=>" + destStateId))))
        }
    }

    return <div data-testid={"transitionArrow"} onClick={(e) => handleClick(e)}>
        {(originStateId == destStateId) ?
            <Xarrow // Transitions to and from the same state
                color="black"
                key={originStateId + "=>" + destStateId}
                id={originStateId + "=>" + destStateId}
                start={originStateId}
                end={destStateId}
                path={"smooth"}

                // Extra Styling for Self-Pointing Arrows
                _cpx1Offset={-30}   // CP 1 X
                _cpy1Offset={-85}   // CP 1 Y
                _cpx2Offset={15}    // CP 2 X
                _cpy2Offset={-85}   // CP 2 Y
                strokeWidth={2.5}
                startAnchor={{ position: "top", offset: { x: -30, y: 12 } }}
                endAnchor={{ position: "bottom", offset: { x: 30, y: -78.9 } }}

                // Input word for transition (may be changed)
                labels={{
                    middle: <input data-testid={"transitionInput"}
                        type="text"
                        className={styles.transitionInput}
                        defaultValue={"A"}
                        id={"input:" + originStateId + "=>" + destStateId}
                        ref={inputRef}
                        onChange={(e) => {
                            setMachine((machine) => {
                                const newMachine = new FSA(machine);
                                newMachine.changeTransitionInput(originStateId, destStateId, e.target.value);
                                return newMachine;
                            })
                        }}

                        // Unhighlight upon hitting Enter key
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.target.blur();
                            }
                        }}
                    />
                }}
            />
            :
            <Xarrow // Transitions between two different states
                color="black"
                key={originStateId + "=>" + destStateId}
                id={originStateId + "=>" + destStateId}
                start={originStateId}
                end={destStateId}
                path={"smooth"} // Allows user to toggle straight or smooth arrow
                curveness={0.2}
                strokeWidth={2.5}
                _extendSVGcanvas={30}

                // Input word for transition (may be changed)
                labels={{
                    middle: <input data-testid={"transitionInput"}
                        type="text"
                        className={styles.transitionInput}
                        style={{marginLeft: 20}} // Margin left to avoid overlapping for vertical transitions
                        defaultValue={"A"}
                        ref={inputRef}
                        id={"input:" + originStateId + "=>" + destStateId}
                        onChange={(e) => {
                            setMachine((machine) => {
                                const newMachine = new FSA(machine);
                                newMachine.changeTransitionInput(originStateId, destStateId, e.target.value);
                                return newMachine;
                            })
                        }}

                        // Unhighlight upon hitting Enter key
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.target.blur(); // Remove focus from input
                            }
                        }}
                    />
                }}
            />
        }
    </div>
}

TransitionArrow.propTypes = {
    originStateId: PropTypes.string,
    destStateId: PropTypes.string
};
