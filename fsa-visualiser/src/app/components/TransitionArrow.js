import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import Xarrow from "react-xarrows"; //https://www.npmjs.com/package/react-xarrows/v/1.7.0#anchors

export const TransitionArrow = ({ originStateId, destStateId }) => {

    const [isStraight, setIsStraight] = useState(true);
    
    return <Xarrow
        color="black"
        key={originStateId + "=>" + destStateId}
        start={originStateId + ""}
        end={destStateId + ""}
        path={"grid"}
        gridBreak={isStraight ? 0 : 1}
        passProps= {{onClick: () => setIsStraight(!isStraight)}}
    />
}

TransitionArrow.propTypes = {
    originStateId: PropTypes.number,
    destStateId: PropTypes.number
};