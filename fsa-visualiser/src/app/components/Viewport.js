import FSA from "../FSA";
import { useRef, useState, useEffect } from "react"
import { StateCircle } from "./StateCircle";
import { TransitionArrow } from "./TransitionArrow";

// Both imports taken from: https://www.npmjs.com/package/react-xarrows/v/1.7.0#anchors
import { Xwrapper } from "react-xarrows";
import Xarrow from "react-xarrows";

export const CIRCLE_RADIUS = 85;
const WIDTH = 72;
const HEIGHT = 95;

/**
 * Function component for the Viewport containing the FSA diagram
 * @param machine Application's FSA
 * @param setMachine Setter for the FSA
 * @returns JSX for the Viewport
 */
export const Viewport = ({ machine, setMachine, organiseLayout, setOrganiseLayout }) => {
  const [circleArray, setCircleArray] = useState([]); // State array containing the JSX of every circle
  const [transitionArray, setTransitionArray] = useState([]); // Array containing all transition arrows
  const [startArrow, setStartArrow] = useState(); // Contains the arrow of the start state
  const [originStateId, setOriginStateId] = useState(null); // Holds the id of the origin state upon making a new transition
  const [positions, setPositions] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    console.log(circleArray);
    console.log(positions);
    
    if (organiseLayout) {
      organiseCircles();
    } else {
      if (circleArray.length > 0) {

    
        // Set all positions to null
        setPositions((current) => {
          const nullPositions = current.map(element => {
            return { id: element.id, position: null };
          })
          return nullPositions;
        });
      }
    }
    console.log(organiseLayout);

  }, [organiseLayout]);


  /**
   * Adds a state circle to the viewport and state to the FSA.
   */
  function addCircle(x, y) {

    const id = machine.total + ""; // Id is unique as total only ever increments.
    // Must be string so transition arrows recognise the id.

    // Must create a new FSA object for 'machine' as object reference will be different,
    // Triggering a re-render for all components with 'machine'
    const newMachine = new FSA(machine);
    newMachine.addState("State " + id);
    setMachine(newMachine);

    // Realigns state circle's coordinates so mouse is in the centre.
    let defaultX = x - CIRCLE_RADIUS / 2;
    let defaultY = y - CIRCLE_RADIUS / 2;

    const newPositions = [...positions, { id: id, position: null }];
    setPositions(newPositions);

    // Adds circle to array of all circles.
    setCircleArray(array => [...array, { id: id, defaultX: defaultX, defaultY: defaultY }])
  }

  function organiseCircles() {
    // Apply ordering by updating position for each node

    // Calculate and change positions - circles will already use null or that
    const newPositions = [...positions];

    for (let index = 0; index < machine.states.length; index++) {
      newPositions[index] = { id: machine.states[index].id, position: { x: 100 * index, y: 100 * index } }
    }

    // if (machine.startStateId != "-1") {

    //   const index = positions.findIndex(element => element.id === machine.startStateId);
    //   newPositions[index] = { id: machine.startStateId, position: { x: WIDTH - 30, y: HEIGHT - 40 } }
    // }

    setPositions(newPositions);
  }

  /**
   * Deletes a state circle and state from the FSA
   */
  function deleteCircle(circleId) {
    const transitionsToDelete = transitionArray.filter(arrow => (arrow.key.startsWith(circleId) || arrow.key.endsWith(circleId)));

    // Delete state from FSA and circle from diagram.
    setMachine((machine) => {
      const newMachine = new FSA(machine);
      transitionsToDelete.forEach(element => { // Delete each transition connected to state.
        const ids = element.key.split("=>");
        newMachine.deleteTransition(ids[0], ids[1]);
      });
      newMachine.deleteState(circleId); // Delete state after all transitions deleted.
      if (newMachine.startStateId == circleId) { newMachine.setStartState("-1"); setStartArrow() }
      return newMachine;
    });
    setCircleArray(array => array.filter(circle => circle.id != circleId))
    setTransitionArray(array => array.filter(arrow => (!arrow.key.startsWith(circleId) && !arrow.key.endsWith(circleId))))
  }

  /**
   * Creates a new transition between two states
   * @param destStateId Id of destination state
   */
  function connectTransition(destStateId) {

    // If transition has not already been added
    if (transitionArray.find(state => state.key == (originStateId + "=>" + destStateId)) == undefined) {

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
        machine={machine}
        setMachine={setMachine}
        setTransitionArray={setTransitionArray}
        data-testid={"transitionArrow"}
      />]);
    }
    setOriginStateId(null); // Reset state so no new transitions are made
  }

  /**
   * Handles all click events in Viewport.
   */
  function handleClick(event) {

    if (event.target.id != "Viewport") {

      // If the target is a state
      if (machine.states.find(state => state.id == event.target.id) != undefined) {
        const circleId = event.target.id;

        if (event.altKey && event.shiftKey) { // Set Start State
          setMachine((machine) => {
            const newMachine = new FSA(machine);
            newMachine.setStartState(circleId);
            return newMachine;
          })
          setStartArrow(<div data-testid={"start"}>
            <Xarrow
              color="black"
              key={"start"}
              id={"start"}
              start={circleId}
              end={circleId}
              path={"smooth"}
              _cpx2Offset={-100}
              strokeWidth={2.5}
              startAnchor="left"
              endAnchor={{ position: "left", offset: { rightness: 100 } }}
            /></div>);
        }

        if (event.altKey && !event.shiftKey) { // Delete
          deleteCircle(circleId);
        } else if (event.shiftKey && !event.altKey) { // Create Transition
          if (originStateId == null) {
            setOriginStateId(circleId);
          } else  // Select Destination State
            connectTransition(circleId);
        }
      }
    } else { // Click on Viewport
      if (originStateId != null) {
        setOriginStateId(null); // Cancel transition setting
      } else {
        if (!event.altKey && !event.shiftKey) {
          addCircle(event.clientX, event.clientY); // Add State
        }
      }
    }
  }

  // Renders Viewport - styles set here as WIDTH and HEIGHT are set constants.
  return <div data-testid={"Viewport"} id={"Viewport"}
    style={{
      width: WIDTH + "svw",
      height: HEIGHT + "svh",
      border: "solid 1.5px black",
      position: "fixed",
      backgroundColor: "white",
    }}
    ref={ref} onClick={(event) => handleClick(event)} >
    <Xwrapper>
      {circleArray.map(circle => (
        <StateCircle
          key={circle.id}
          machine={machine}
          setMachine={setMachine}
          id={circle.id}
          defaultX={circle.defaultX}
          defaultY={circle.defaultY}
          CIRCLE_RADIUS={CIRCLE_RADIUS}
          positions={positions}
          setOrganiseLayout={setOrganiseLayout}
        />
      ))}
      {transitionArray}
      {startArrow}
    </Xwrapper>
  </div>
}