import styles from '../../styles/Viewport.module.css'
import useMouse from '@react-hook/mouse-position' // https://www.npmjs.com/package/@react-hook/mouse-position
import { useRef, useState } from "react"
import { addState, updateStateName } from "./FSA"
import Draggable from 'react-draggable'; // https://www.npmjs.com/package/react-draggable
import React from 'react';


const CIRCLE_RADIUS = 75;
const height = 70;
const width = 70;

/**
 * Maintains the viewport containing the FSA diagram.
 */
export const Viewport = ({ machine, setMachine }) => {
  const [circleArray, setCircleArray] = useState([]); // State array containing the JSX of every circle
  const [currentPositions, setCurrentPositions] = useState([]); // State array of all circle's current positions
  
  // Mouse tracking copied from: https://www.npmjs.com/package/@react-hook/mouse-position
  const ref = useRef(null)
  const mouse = useMouse(ref, {})
  // End of copied code.

  function updatePosition(id, newX, newY) {
    setCurrentPositions(currentPos =>
      currentPos.map(circle =>
        circle.id === id
          ? { ...circle, x: newX, y: newY }
          : circle
      ))
  }

  function addCircle() {

    const isOverlapping = currentPositions.some(element => {
      if (Math.abs(mouse.x - element.x) < CIRCLE_RADIUS && Math.abs(mouse.y - element.y) < CIRCLE_RADIUS) {
        return true;
      }
      return false;
    });

    if (isOverlapping) {
      return; // Do not add a circle if mouse is over another
    }

    setMachine(addState("Unnamed"));

    const id = machine.total;
    let circleX = mouse.x - CIRCLE_RADIUS / 2;
    let circleY = mouse.y - CIRCLE_RADIUS / 2;

    setCircleArray(
      [...circleArray,
      <Draggable bounds="parent" key={id} defaultPosition={{ x: circleX, y: circleY }} onDrag={(data) => updatePosition(id, data.x, data.y)}>



          <input className={styles.stateInput} type="text" defaultValue={"Unnamed"}
            onChange={(e) => setMachine(updateStateName(id, e.target.value))}
            style={{ height: CIRCLE_RADIUS, width: CIRCLE_RADIUS, textAlign: "center" }} />

      
      </Draggable >
      ])

    // Use 'array' instead of currentPositions due to possible asynchronicity, 'array' = latest state
    setCurrentPositions(array => [...array, { id: id, x: circleX, y: circleY }])
    console.log(currentPositions);
  }


  return <div className={styles.Viewport}
    style={{ height: height + "svh", width: width + "svw" }}
    ref={ref} onClick={() => addCircle()}>
    {circleArray}
  </div>
}
