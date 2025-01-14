import styles from "../../styles/Viewport.module.css"
import { useRef, useState } from "react"
import { StateCircle } from "./StateCircle";

export const CIRCLE_RADIUS = 75;

/**
 * Function component for the Viewport containing the FSA diagram
 * @param machine FSA object
 * @param setMachine Function to update FSA object
 * @returns JSX for the Viewport
 */
export const Viewport = ({ machine, setMachine }) => {
  const [circleArray, setCircleArray] = useState([]); // State array containing the JSX of every circle
  const [currentPositions, setCurrentPositions] = useState([]); // State array of all circles' current positions

  const ref = useRef(null)

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
          ? { id: id, x: newX, y: newY }
          : circle
      ))
  }

  /**
   * Calculates the id of the state circle which the mouse is hovering over
   * @returns the id of the state, or -1 if the mouse is not hovering over any
   */
  function getCircleOverlap(x, y) {
    // Check if the mouse is currently clicking on another state cirlce
    for (let i = 0; i < currentPositions.length; i++) {
      // If mouse position is within range of the circle + its radius
      if (Math.abs(x - currentPositions[i].x) < CIRCLE_RADIUS && Math.abs(y - currentPositions[i].y) < CIRCLE_RADIUS) {
        return currentPositions[i].id;
      }
    }
    return -1; // Mouse is not hovering over a state circle.
  }

  /**
   * Adds a state circle to the viewport and state to the FSA.
   */
  function addCircle(x, y) {
    // If the mouse has clicked on a state circle, do not add one on top.
    if (getCircleOverlap(x, y) != -1) {
      return;
    }
    const id = machine.total; // Id is unique as total only ever increments.

    setMachine(machine.addState("Unnamed")); // Adds state to machine.

    // Realigns state circle's coordinates so mouse is in the centre.
    let circleX = x - CIRCLE_RADIUS / 2;
    let circleY = y - CIRCLE_RADIUS / 2;

    // Adds circle to array of all circles.
    setCircleArray(
      [...circleArray,
      <StateCircle
        key={id}
        machine={machine}
        setMachine={setMachine}
        id={id}
        circleX={circleX}
        circleY={circleY}
        CIRCLE_RADIUS={CIRCLE_RADIUS}
        updatePosition={updatePosition} />
      ])

    // Adds state circle's position to array of all circle positions.
    setCurrentPositions(array => [...array, { id: id, x: circleX, y: circleY }])
  }

  /**
   * Deletes a state circle and state from the FSA
   */
  function deleteCircle(x, y) {
    // Do nothing if did not click on a state circle.
    let circleId = getCircleOverlap(x, y);
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
    if (event.altKey) {
      deleteCircle(event.clientX, event.clientY);
    } else {
      addCircle(event.clientX, event.clientY);
    }
  }

  // Renders Viewport.
  return <div className={styles.Viewport} data-testid={"Viewport"}
    ref={ref} onClick={(event) => handleClick(event)} >
    {circleArray}
  </div>
}
