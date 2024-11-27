import styles from "../../styles/Viewport.module.css"
import useMouse from "@react-hook/mouse-position" // https://www.npmjs.com/package/@react-hook/mouse-position
import { useRef, useState } from "react"
import { addState, updateStateName } from "./FSA"
import Draggable from 'react-draggable'; // https://www.npmjs.com/package/react-draggable

const CIRCLE_RADIUS = 75; 
// Viewport dimension relative to screen size (svh/svw)
const height = 70;
const width = 70; 

/**
 * Function component for the Viewport containing the FSA diagram
 * @param machine FSA object
 * @param setMachine Function to update FSA object
 * @returns JSX for the Viewport
 */
export const Viewport = ({ machine, setMachine }) => {
  const [circleArray, setCircleArray] = useState([]); // State array containing the JSX of every circle
  const [currentPositions, setCurrentPositions] = useState([]); // State array of all circle's current positions

  // Mouse tracking copied from: https://www.npmjs.com/package/@react-hook/mouse-position
  const ref = useRef(null)
  const mouse = useMouse(ref, {})
  // End of copied code.

  /**
   * Updates the possition of a state circle upun being dragged
   * @param {int} id of state
   * @param {int} newX coordinate of circle
   * @param {int} newY coordinate of circle
   */
  function updatePosition(id, newX, newY) {
    // Update the entry in currentPositions where the id matches.
    setCurrentPositions(currentPos =>
      currentPos.map(circle =>
        circle.id === id
          ? { ...circle, x: newX, y: newY }
          : circle
      ))
  }

  function addCircle() {
    // Check if the mouse is currently clicking on another state cirlce
    const isOverlapping = currentPositions.some(element => {
      // If mouse position is within range of the circle + its radius
      if (Math.abs(mouse.x - element.x) < CIRCLE_RADIUS && Math.abs(mouse.y - element.y) < CIRCLE_RADIUS) {
        return true;
      }
      return false;
    });

    // If it is overlapping a state circle, do not add a new one.
    if (isOverlapping) {
      return; // Do not add a circle if mouse is over another
    }

    setMachine(addState("Unnamed"));

    const id = machine.total; // Id is unique as total only ever increments
    // Circle is generated with its top right corner where mouse is.
    // Set circle's coordinates to move half up and to the left so centre is aligned with mouse position.
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

    // 'array' represents the latest value of currentPositions due to possible asynchronicity
    setCurrentPositions(array => [...array, { id: id, x: circleX, y: circleY }])
  }

  return <div className={styles.Viewport}
    style={{ height: height + "svh", width: width + "svw" }}
    ref={ref} onClick={() => addCircle()}>
    {circleArray}
  </div>
}
