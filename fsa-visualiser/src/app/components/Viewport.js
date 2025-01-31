import styles from "../../styles/Viewport.module.css"
import { useEffect, useRef, useState } from "react"
import { StateCircle } from "./StateCircle";
import { TransitionArrow } from "./TransitionArrow";

export const CIRCLE_RADIUS = 85;
const WIDTH = 72;
const HEIGHT = 95;

/**
 * Function component for the Viewport containing the FSA diagram
 * @param machine Application's FSA
 * @param setMachine Setter for the FSA
 * @returns JSX for the Viewport
 */
export const Viewport = ({ machine, setMachine }) => {
  const [circleArray, setCircleArray] = useState([]); // State array containing the JSX of every circle
  const [currentPositions, setCurrentPositions] = useState([]); // State array of all circles' current positions
  const [transitionArray, setTransitionArray] = useState([]); // Holds
  const [originStateId, setOriginStateId] = useState(-1);
  const ref = useRef(null);

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
    console.log(currentPositions);    
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
    setMachine(machine.addState("State " + id)); // Adds state to machine.

    // Realigns state circle's coordinates so mouse is in the centre.
    let circleX = x - CIRCLE_RADIUS / 2;
    let circleY = y - CIRCLE_RADIUS / 2;

    // Adds circle to array of all circles.
    setCircleArray(array =>
      [...array,
      <StateCircle
        key={id}
        machine={machine}
        setMachine={setMachine}
        id={id}
        circleX={circleX}
        circleY={circleY}
        CIRCLE_RADIUS={CIRCLE_RADIUS}
        updatePosition={updatePosition}
      />
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
    setCircleArray(localCircles.filter(circle => circle.key != circleId))
    setCurrentPositions(currentPositions.filter(element => element.id != circleId))
  }

  function startTransition(x, y) {
    // Do nothing if did not click on a state circle.
    let circleId = getCircleOverlap(x, y);
    if (circleId == -1) {
      return;
    }
    setOriginStateId(circleId);
  }

  function connectTransition(x, y) {
    // Do nothing if did not click on a state circle.
    let destStateId = getCircleOverlap(x, y);
    if (destStateId == -1) {
      setOriginStateId(-1);
      return;
    }

    console.log(transitionArray);
    console.log(originStateId);
    console.log(destStateId);

    setMachine(machine.addTransition(originStateId, destStateId, 'A'))
    setTransitionArray(array => [...array,
    <TransitionArrow
      key={originStateId + "=>" + destStateId}
      originStateId={originStateId}
      destStateId={destStateId}
      currentPositions={localCircles}
      startPos={currentPositions.find(state => state.id == originStateId)}
      endPos={currentPositions.find(state => state.id == destStateId)}
      isDragging={isDragging}
    />]);
    setOriginStateId(-1);
  }

  /**
   * Handles all click events in Viewport.
   */
  function handleClick(event) {

    const x = event.clientX; // Take off left margin
    const y = event.clientY; // Take off top margin

    if (event.altKey) { // Delete
      deleteCircle(x, y);
    } else if (event.shiftKey) { // Create Transition
      startTransition(x, y);
    } else {
      if (originStateId !== -1) { // Select Destination State
        connectTransition(x, y)
      } else {
        addCircle(x, y); // Add State
      }
    }
  }

  // Renders Viewport.
  return <div className={styles.Viewport} data-testid={"Viewport"}
    style={{ width: WIDTH + "svw", height: HEIGHT + "svh" }}
    ref={ref} onClick={(event) => handleClick(event)} >
    {circleArray}
    {transitionArray}
  </div>
}