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

// Returns an array of child nodes
function findChildren(nodeId, allParents, machine) {

  console.log(machine);

  allParents.push(nodeId);
  
  const transitions = machine.states.find(state => state.id == nodeId).transitions;

  console.log(transitions);
  
  let currentChildren = []; // Array of node's children

  if (transitions.length == 0) {
    return null; // Base case
  }

  // Add all children to array.
  transitions.forEach(transition => {
    const child = transition[1];
    if (!(allParents.includes(child))) { // Don't explore transitions pointing to parents or self
      currentChildren.push(child);
    }
  });

  if (currentChildren.length == 0) {
    return null; // Base case
  }

  let diagram = [];
  // For each child, return a node of their id and array of children
  currentChildren.forEach(child => {
      diagram.push([child,findChildren(child, allParents, machine)]);
  });

  return diagram;
}

function myAlgorithm(machine) {

  if (machine.startStateId == "-1") {
    return [];
  }

  let diagram = [];
  let currentNode = machine.startStateId;

  diagram = [[currentNode, findChildren(currentNode, [machine.startStateId], machine)]];

  return diagram;
}

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
    // console.log(circleArray);
    // console.log(positions);

    if (organiseLayout) {
      organiseCircles();
      setOrganiseLayout(false);
    } else {
      if (circleArray.length > 0) {
        console.log("reset");

        // Set all positions to null
        setPositions((current) => {
          const nullPositions = current.map(element => {
            return { id: element.id, position: null };
          })
          return nullPositions;
        });
      }
    }
    //console.log(organiseLayout);

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

    // Add children, for each child, add children



    let topologicalOrder = myAlgorithm(machine);

    console.log(topologicalOrder);

    // const startIndex = topologicalOrder.findIndex(state => state == machine.startStateId);
    // if (startIndex != 0) {

    // }

    // Just need to find level of each node.

    // Draw start state here.

    let currentNodes = topologicalOrder;
    let minHeight = 0;
    let maxHeight = 100;
    while (currentNodes.length > 0) {
      // Draw at centre of height / length of nodes
      // Break into n slices

      // (max - min) / n = length
      // Add and minus

      // Make all positions array as percentages and then apply them in state circle

      // This is for a single split, for this draw children, add if not null.
      const length = (maxHeight - minHeight) / currentNodes.length; // Length of splice

      currentNodes.forEach(node => {
        
        if (node[1] != null) { // Leaf node
          // Draw current node in the cent
        }
      });

      

      // Draw all children, if any are not null, add them.
      if (condition) {
        
      }      
    }
    

    // Calculate and change positions - circles will already use null or that
    const newPositions = [...positions];

    for (let index = 0; index < machine.states.length; index++) {
      newPositions[index] = { id: machine.states[index].id, position: { x: 100 * index, y: 100 * index } }
    }

    console.log();

    

    console.log("sret");

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
      {circleArray.map(circle => {
        const position = positions.find((pos) => pos.id === circle.id).position;
        return <StateCircle
          key={circle.id}
          machine={machine}
          setMachine={setMachine}
          id={circle.id}
          defaultX={circle.defaultX}
          defaultY={circle.defaultY}
          CIRCLE_RADIUS={CIRCLE_RADIUS}
          position={position}
        />
      })}
      {transitionArray}
      {startArrow}
    </Xwrapper>
  </div>
}