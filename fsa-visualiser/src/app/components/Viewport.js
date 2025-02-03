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
  const [currentPositions, setCurrentPositions] = useState([]);
  const [transitionArray, setTransitionArray] = useState([]);
  const [originStateId, setOriginStateId] = useState(null);
  const ref = useRef(null);

  /**
   * Updates the position of a state circle upon being dragged.
   * @param {String} id of state
   * @param {int} newX coordinate of circle
   * @param {int} newY coordinate of circle
   */
  function updatePosition(id, newX, newY) {
    // Update the entry in currentPositions where the id matches.
    setCurrentPositions((currentPos) => {
      const newPost = currentPos.map(circle => circle.id === id ? { id: id, x: newX, y: newY } : circle)
      return newPost;
    }
    )
  }

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
      updatePosition={updatePosition}
    />
    ])

    setCurrentPositions(array => [...array, { id: id, x: circleX, y: circleY }])
  }

  /**
   * Deletes a state circle and state from the FSA
   */
  function deleteCircle(circleId) {
    // Delete state from FSA and circle from diagram.
    setMachine((machine) => {
      const newMachine = new FSA(machine);
      newMachine.deleteState(circleId);
      return newMachine;
    });
    setCircleArray(array => array.filter(circle => circle.key != circleId))
    setCurrentPositions(array => array.filter(element => element.id != circleId))
  }

  function connectTransition(destStateId) {

    setMachine((machine) => {
      const newMachine = new FSA(machine);
      newMachine.addTransition(originStateId, destStateId, 'A');
      return newMachine;
    });

    setTransitionArray(array => [...array,
    <TransitionArrow
      key={originStateId + "=>" + destStateId}
      originStateId={originStateId}
      destStateId={destStateId}
      currentPositions={currentPositions}
      input={"A"}
    />]);
    setOriginStateId(null);
  }

  /**
   * Handles all click events in Viewport.
   */
  function handleClick(event) {

    if (event.target.id != "Viewport") {
      const circleId = event.target.id;
      console.log(circleId);
      

      if (event.altKey) { // Delete
        deleteCircle(circleId);
      } else if (event.shiftKey) { // Create Transition
        setOriginStateId(circleId);
      } else {
        if (originStateId != null) { // Select Destination State
          connectTransition(circleId);
        }
      }
    } else {
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