import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import Xarrow from "react-xarrows"; //https://www.npmjs.com/package/react-xarrows/v/1.7.0#anchors

export const TransitionArrow = ({ originStateId, destStateId, currentPositions, input }) => {

    const [isStraight, setIsStraight] = useState(true);

    useEffect(() => {
        console.log("Child currentPositions:", currentPositions);
        console.log(typeof destStateId);
        console.log(typeof originStateId);
    }, [currentPositions])

    return <Xarrow
        color="black"
        key={`${originStateId}-${destStateId}`}
        start={originStateId}
        end={destStateId}
        path={"smooth"}
        curveness={0.2}
        strokeWidth={2.5}
        label={<div style={{ fontSize: "1.3em", fontFamily: "fantasy", fontStyle: "italic" }}>{input}</div>}
        passProps={{ onClick: () => setIsStraight(!isStraight) }}
    />
}

TransitionArrow.propTypes = {
    originStateId: PropTypes.number,
    destStateId: PropTypes.number
};