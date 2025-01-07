import styles from "../../styles/Viewport.module.css"
import useMouse from "@react-hook/mouse-position" // https://www.npmjs.com/package/@react-hook/mouse-position
import { useRef, useState } from "react"
import Draggable from 'react-draggable'; // https://www.npmjs.com/package/react-draggable

const CIRCLE_RADIUS = 75;
// Viewport dimensions relative to screen size (svh/svw):
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
  const [currentPositions, setCurrentPositions] = useState([]); // State array of all circles' current positions

  // Mouse tracking copied from: https://www.npmjs.com/package/@react-hook/mouse-position
  const ref = useRef(null)
  const mouse = useMouse(ref, {})
  // End of copied code.

  /**
   * Updates the position of a state circle upon being dragged.
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

  /**
   * Calculates the id of the state circle which the mouse is hovering over
   * @returns the id of the state, or -1 if the mouse is not hovering over any
   */
  function getCircleOverlap() {
    // Check if the mouse is currently clicking on another state cirlce
    for (let i = 0; i < currentPositions.length; i++) {
      // If mouse position is within range of the circle + its radius
      if (Math.abs(mouse.x - currentPositions[i].x) < CIRCLE_RADIUS && Math.abs(mouse.y - currentPositions[i].y) < CIRCLE_RADIUS) {
        return currentPositions[i].id;
      }
    }
    return -1; // Mouse is not hovering over a state circle.
  }

  /**
   * Adds a state circle to the viewport and state to the FSA.
   */
  function addCircle() {
    // If the mouse has clicked on a state circle, do not add one on top.
    if (getCircleOverlap() != -1) {      
      return; 
    }

    setMachine(machine.addState("Unnamed")); // Adds state to machine.
    
    const id = machine.total; // Id is unique as total only ever increments.

    // Realigns state circle's coordinates so mouse is in the centre.
    let circleX = mouse.x - CIRCLE_RADIUS / 2;
    let circleY = mouse.y - CIRCLE_RADIUS / 2;

    // Adds circle to array of all circles.
    setCircleArray(
      [...circleArray,

      // Places circular text input inside a draggable div.
      <Draggable bounds="parent" key={id} defaultPosition={{ x: circleX, y: circleY }} onDrag={(data) => updatePosition(id, data.x, data.y)} data-testid="stateCircle">
        <input className={styles.stateInput} type="text" defaultValue={id}
          onChange={(e) => setMachine(machine.updateStateName(id, e.target.value))}
          style={{ height: CIRCLE_RADIUS, width: CIRCLE_RADIUS, textAlign: "center" }} />
      </Draggable >
      ])

    // Adds state circle's position to array of all circle positions.
    setCurrentPositions(array => [...array, { id: id, x: circleX, y: circleY }])
  }

  /**
   * Deletes a state circle and state from the FSA
   */
  function deleteCircle() {
    // Do nothing if did not click on a state circle.
    let circleId = getCircleOverlap();
    if (circleId == -1) {      
      return;
    }

    // Delete state from FSA and circle from diagram.
    setMachine(machine.deleteState(circleId));
    setCircleArray(circleArray.filter(circle => circle.key != circleId))
    setCurrentPositions(currentPositions.filter(element => element.id != circleId))
  }

  /**
   * Handles all click events in Viewport.
   */
  function handleClick(event) {
    if (event.shiftKey) {
      deleteCircle();
    } else {
      addCircle();
    }
  }

  // Renders Viewport.
  return <div className={styles.Viewport} data-testid={"Viewport"}
    style={{ height: height + "svh", width: width + "svw" }}
    ref={ref} onClick={(event) => handleClick(event)}>
    {circleArray}
  </div>
}
