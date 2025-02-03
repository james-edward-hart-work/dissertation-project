import { useState } from "react";
import FSA from "../FSA";
import PropTypes from 'prop-types';
import Xarrow from "react-xarrows"; //https://www.npmjs.com/package/react-xarrows/v/1.7.0#anchors

export const TransitionArrow = ({ originStateId, destStateId, input, setMachine, setTransitionArray }) => {

    const [isStraight, setIsStraight] = useState(true);

    function handleClick(event) {
        if (event.altKey) {
            setMachine((machine) => {
                const newMachine = new FSA(machine);
                newMachine.deleteTransition(originStateId, destStateId);
                return newMachine;
              });
              setTransitionArray(array => array.filter(arrow => arrow.key != originStateId + "=>" + destStateId))
        } else {
            setIsStraight(!isStraight)
        }
    }

    return <Xarrow
        color="black"
        key={originStateId + "=>" + destStateId}
        id={originStateId + "=>" + destStateId}
        start={originStateId}
        end={destStateId}
        path={"smooth"}
        curveness={0.2}
        strokeWidth={2.5}
        label={<div style={{ fontSize: "1.3em", fontFamily: "fantasy", fontStyle: "italic" }}>{input}</div>}
        passProps={{ onClick: (e) =>  handleClick(e)}}
    />
}

TransitionArrow.propTypes = {
    originStateId: PropTypes.string,
    destStateId: PropTypes.string
};