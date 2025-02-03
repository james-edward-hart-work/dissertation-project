import FSA from "../FSA";
import { useRef, useState } from "react"
import styles from "../../styles/Viewport.module.css"
import { StateCircle } from "./StateCircle";
import { TransitionArrow } from "./TransitionArrow";
import { Xwrapper } from "react-xarrows"; //https://www.npmjs.com/package/react-xarrows/v/1.7.0#anchors

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
  const [transitionArray, setTransitionArray] = useState([]);
  const [originStateId, setOriginStateId] = useState(null);
  const ref = useRef(null);

  /**
   * Adds a state circle to the viewport and state to the FSA.
   */
  function addCircle(x, y) {

    const id = machine.total + ""; // Id is unique as total only ever increments.
    // Must be string so transition arrows recognise the id.

    // Must create a new FSA object for 'machine' as object reference will be different,
    // Triggering a re-render for all components with 'machine'
    setMachine((machine) => {
      const newMachine = new FSA(machine);
      newMachine.addState("State " + id);
      return newMachine;
    });

    // Realigns state circle's coordinates so mouse is in the centre.
    let circleX = x - CIRCLE_RADIUS / 2;
    let circleY = y - CIRCLE_RADIUS / 2;

    // Adds circle to array of all circles.
    setCircleArray(array => [...array,
    <StateCircle
      key={id}
      machine={machine}
      setMachine={setMachine}
      id={id}
      circleX={circleX}
      circleY={circleY}
      CIRCLE_RADIUS={CIRCLE_RADIUS}
    />])
  }

  /**
   * Deletes a state circle and state from the FSA
   */
  function deleteCircle(circleId) {
    const transitionsToDelete = transitionArray.filter(arrow => (!arrow.key.startsWith(circleId) || !arrow.key.endsWith(circleId)));
    
    // Delete state from FSA and circle from diagram.
    setMachine((machine) => {
      const newMachine = new FSA(machine);
      transitionsToDelete.forEach(element => { // Delete each transition connected to state.
        const ids = element.key.split("=>");
        newMachine.deleteTransition(ids[0], ids[1]);
      });
      newMachine.deleteState(circleId); // Delete state after all transitions deleted.
      if (newMachine.startStateId == circleId) { newMachine.setStartState(-1) }
      return newMachine;
    });
    setCircleArray(array => array.filter(circle => circle.key != circleId))
    setTransitionArray(array => array.filter(arrow => (!arrow.key.startsWith(circleId) && !arrow.key.endsWith(circleId))))
  }

  function connectTransition(destStateId) {

    setMachine((machine) => {
      const newMachine = new FSA(machine);
      newMachine.addTransition(originStateId, destStateId, 'A');
      return newMachine;
    });

    setTransitionArray(array => [...array,
    <TransitionArrow
      id={originStateId + "=>" + destStateId}
      key={originStateId + "=>" + destStateId}
      originStateId={originStateId}
      destStateId={destStateId}
      input={"A"}
      setMachine={setMachine}
      setTransitionArray={setTransitionArray}
    />]);
    setOriginStateId(null);
  }

  /**
   * Handles all click events in Viewport.
   */
  function handleClick(event) {

    if (event.target.id != "Viewport") {
      const circleId = event.target.id;

      if (event.altKey) { // Delete
        deleteCircle(circleId);
      } else if (event.shiftKey) { // Create Transition
        setOriginStateId(circleId);
      } else {
        if (originStateId != null) { // Select Destination State
          connectTransition(circleId);
        }
      }
    } else { // Click on Viewport
      if (originStateId != null) {
        setOriginStateId(null);
      } else {
        addCircle(event.clientX, event.clientY); // Add State
      }
    }
  }

  // Renders Viewport.
  return <div className={styles.Viewport} data-testid={"Viewport"} id={"Viewport"}
    style={{ width: WIDTH + "svw", height: HEIGHT + "svh" }}
    ref={ref} onClick={(event) => handleClick(event)}>
    <Xwrapper>
      {circleArray}
      {transitionArray}
    </Xwrapper>
  </div>
}