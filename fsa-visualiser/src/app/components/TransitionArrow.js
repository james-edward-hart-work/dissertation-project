import { useState } from "react";
import FSA from "../FSA";
import PropTypes from 'prop-types';
import Xarrow from "react-xarrows"; // https://www.npmjs.com/package/react-xarrows/v/1.7.0
import styles from "../../styles/TransitionArrow.module.css"

export const TransitionArrow = ({ originStateId, destStateId, setMachine, setTransitionArray }) => {

    const [isStraight, setIsStraight] = useState(false);

    function handleClick(event) {
        if (event.altKey) { // Delete transition
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

    return <div>
        {(originStateId == destStateId) ?
            <Xarrow // Self-pointing transitions
                color="black"
                key={originStateId + "=>" + destStateId}
                id={originStateId + "=>" + destStateId}
                start={originStateId}
                end={destStateId}
                passProps={{ onClick: (e) => handleClick(e) }}
                path={"smooth"}
                _cpx1Offset={-50}
                _cpy1Offset={-100}
                _cpx2Offset={-100}
                _cpy2Offset={-30}
                strokeWidth={2.5}
                startAnchor={{ position: "top" }}
                endAnchor={{ position: "left", offset: { rightness: 100 } }}
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
            <Xarrow // Regular transitions
                color="black"
                key={originStateId + "=>" + destStateId}
                id={originStateId + "=>" + destStateId}
                start={originStateId}
                end={destStateId}
                passProps={{ onClick: (e) => handleClick(e) }}
                path={isStraight ? "straight" : "smooth"}
                curveness={0.2}
                strokeWidth={2.5}
                _extendSVGcanvas={30}
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
