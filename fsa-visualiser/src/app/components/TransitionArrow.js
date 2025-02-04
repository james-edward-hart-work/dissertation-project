import { useState } from "react";
import FSA from "../FSA";
import PropTypes from 'prop-types';
import Xarrow from "react-xarrows"; //https://www.npmjs.com/package/react-xarrows/v/1.7.0#anchors
import styles from "../../styles/TransitionArrow.module.css"

export const TransitionArrow = ({ originStateId, destStateId, input, machine, setMachine, setTransitionArray }) => {

    const [isStraight, setIsStraight] = useState(false);
    const label = machine.states.find(state => state.id === originStateId)
    //.transitions.find(transition => transition[1] == destStateId);

    function handleClick(event) {
        if (event.altKey) {
            setMachine((machine) => {
                const newMachine = new FSA(machine);
                newMachine.deleteTransition(originStateId, destStateId);
                return newMachine;
            });
            setTransitionArray(array => array.filter(arrow => (arrow.key != (originStateId + "=>" + destStateId))))

        } else {
            setIsStraight(!isStraight)
        }
    }

    return <div style={{ overflow: "visible" }} >
        <input data-testid={"transitionInput"}
            type="text"
            className={styles.transitionInput}
            defaultValue={"A"}
            onChange={(e) => {
                setMachine((machine) => {
                    const newMachine = new FSA(machine);
                    newMachine.changeTransitionInput(originStateId, destStateId, e.target.value);
                    return newMachine;
                });
            }}
        />

        {(originStateId == destStateId) ?
            <Xarrow // Self-pointing transitions
                color="black"
                key={originStateId + "=>" + destStateId}
                id={originStateId + "=>" + destStateId}
                start={originStateId}
                end={destStateId}
                path={"smooth"}
                _cpx1Offset={-50}
                _cpy1Offset={-100}
                _cpx2Offset={-100}
                _cpy2Offset={-30}
                strokeWidth={2.5}
                startAnchor={{ position: "top" }}
                endAnchor={{ position: "left", offset: { rightness: 100 } }}
                label={<div style={{ fontSize: "1.3em", fontFamily: "fantasy", fontStyle: "italic" }}>{input}</div>}
                passProps={{ onClick: (e) => handleClick(e) }}
            /> 
            : 
            <Xarrow // Regular transitions
                color="black"
                key={originStateId + "=>" + destStateId}
                id={originStateId + "=>" + destStateId}
                start={originStateId}
                end={destStateId}
                path={isStraight ? "straight" : "smooth"}
                curveness={0.2}
                strokeWidth={2.5}
                passProps={{ onClick: (e) => handleClick(e) }}
                label="label"
                _extendSVGcanvas={30}
            // Put input inside label prop
            />
        }
    </div>
}

TransitionArrow.propTypes = {
    originStateId: PropTypes.string,
    destStateId: PropTypes.string
};
