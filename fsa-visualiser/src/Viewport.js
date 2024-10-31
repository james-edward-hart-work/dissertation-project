import styles from "./styles/Viewport.module.css"
import useMouse from "@react-hook/mouse-position" // https://www.npmjs.com/package/@react-hook/mouse-position
import { useRef, useState } from "react"
import { addState } from "./FSA"
import Draggable from 'react-draggable'; // https://www.npmjs.com/package/react-draggable

const circleRadius = 50;

/**
 * Maintains the viewport containing the FSA diagram.
 */
export const Viewport = ({ machine, setMachine }) => {
  const [clickLock, setClickLock] = useState(true);
  const [circleArray, setCircleArray] = useState([]);
  // Mouse tracking copied from: https://www.npmjs.com/package/@react-hook/mouse-position
  const ref = useRef(null)
  const mouse = useMouse(ref, {})
  // End of copied code.

  // User Click on Viewport
  if (mouse.isDown && clickLock) {
    setClickLock(false);

    setCircleArray(
      [...circleArray,
      <Draggable defaultPosition={{ x: mouse.x - circleRadius, y: mouse.y - circleRadius }}>
        <svg height="100" width="100" xmlns="http://www.w3.org/2000/svg">
          <circle className="circle" r={circleRadius - 5} cx={circleRadius} cy={circleRadius} fill="white" stroke="black" stroke-width="2"/>
        </svg>
      </Draggable>
      ])
    setMachine(addState(machine, "Unnamed"));
  }

  // if (!mouse.isDown) {
  //   setClickLock(true);
  // }

  // if (!mouse.isDown) {
  //   setClickLock(true);
  // }

  return <div className={styles.Viewport} ref={ref}>
    {circleArray}
  </div>
}
