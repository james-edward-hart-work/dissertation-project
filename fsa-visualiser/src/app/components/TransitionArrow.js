import { useState } from "react";
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

    const [isStraight, setIsStraight] = useState(false); // Tracks whether the arrow is straight or curved

    function handleClick(event) {
        if (event.altKey) { // Deletes transition
            setMachine((machine) => {
                const newMachine = new FSA(machine);
                newMachine.deleteTransition(originStateId, destStateId);
                return newMachine;
            });

            setTransitionArray(array => array.filter(arrow => (arrow.key != (originStateId + "=>" + destStateId))))
        } else {
            setIsStraight(!isStraight) // Toggle straightness of arrow
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
                _cpx1Offset={-50}
                _cpy1Offset={-100}
                _cpx2Offset={-100}
                _cpy2Offset={-30}
                strokeWidth={2.5}
                startAnchor="top"
                endAnchor={{ position: "left", offset: { x: -10, y: 0 } }}

                // Input word for transition (may be changed)
                labels={{
                    middle: <input data-testid={"transitionInput"}
                        type="text"
                        className={styles.transitionInput}
                        defaultValue={"A"}
                        onChange={(e) => {
                            setMachine((machine) => {
                                const newMachine = new FSA(machine);
                                newMachine.changeTransitionInput(originStateId, destStateId, e.target.value);
                                return newMachine;
                            })
                        }} />
                }}
                arrowHead={{ style: { transform: "rotateY(180deg)" } }}
            />
            :
            <Xarrow // Transitions between two different states
                color="black"
                key={originStateId + "=>" + destStateId}
                id={originStateId + "=>" + destStateId}
                start={originStateId}
                end={destStateId}
                path={isStraight ? "straight" : "smooth"} // Allows user to toggle straight or smooth arrow
                curveness={0.2}
                strokeWidth={2.5}
                _extendSVGcanvas={30}

                // Input word for transition (may be changed)
                labels={{
                    middle: <input data-testid={"transitionInput"}
                        type="text"
                        className={styles.transitionInput}
                        defaultValue={"A"}
                        onChange={(e) => {
                            setMachine((machine) => {
                                const newMachine = new FSA(machine);
                                newMachine.changeTransitionInput(originStateId, destStateId, e.target.value);
                                return newMachine;
                            })
                        }} />
                }}
            />
        }
    </div>
}

TransitionArrow.propTypes = {
    originStateId: PropTypes.string,
    destStateId: PropTypes.string
};
