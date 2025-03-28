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
 * @param setOrganiseLayout Tracks whether layout is to be organised or loose
 * @param setOrganiseLayout Setter for organiseLayout
 * @returns JSX for the Viewport
 */
export const Viewport = ({ machine, setMachine, organiseLayout, setOrganiseLayout }) => {
  const [circleArray, setCircleArray] = useState([]);           // State array containing the JSX of every circle
  const [transitionArray, setTransitionArray] = useState([]);   // Array containing all transition arrows
  const [startStateX, setStartStateX] = useState();             // States whether the start arrow is shown or not
  const [originStateId, setOriginStateId] = useState(null);     // Holds the id of the origin state upon making a new transition
  const [positions, setPositions] = useState([]);               // Holds all fixed positions of circles when organised, null if draggable 
  const ref = useRef(null);                                     // Reference to Viewport to contain circles

  // Every time organiseLayout is set, make state positions fixed or draggable.
  useEffect(() => {
    if (organiseLayout) { // If button in InteractionWindow clicked, organise circles
      organiseCircles();
      if (organiseLayout) setOrganiseLayout(false); // Allow circles to be draggable again after organisation
    } else {

      if (circleArray.length > 0) {
        // Set all positions to null to be draggable after reorganising.
        setPositions((current) => {
          const nullPositions = current.map(element => {
            return { id: element.id, position: null };
          })
          return nullPositions;
        });
      }
    }
  }, [organiseLayout]);

  // Every frame, position the start state arrow to the x value of the start state.
  useEffect(() => {
    if (startStateX != null && machine.startStateId != "-1") {
      setStartStateX(document.getElementById(machine.startStateId).getBoundingClientRect().x);
    }
  });

  // Adds a state circle to the viewport and state to the FSA.
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

    // Sets all fixed positions to null so circles are draggable.
    const newPositions = [...positions, { id: id, position: null }];
    setPositions(newPositions);

    // Adds circle to array of all circles.
    setCircleArray(array => [...array, { id: id, defaultX: defaultX, defaultY: defaultY }])
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
      if (newMachine.startStateId == circleId) { newMachine.setStartState("-1"); setStartStateX(null) }
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

  // Repositions circles to fixed positions based on FSA layout
  function organiseCircles() {
    if (machine.status() != "Invalid") {

      // Calculate organised positions.
      const newPositions = organiseChildren(machine.startStateId, [], 0, 100, machine);

      // Do not organise if machine contains hanging states. 
      for (let index = 0; index < machine.states.length; index++) {
        if (newPositions.filter(pos => pos.id == machine.states[index].id).length == 0) {
          alert("Machine contains states with no parents.");
          return;
        }
      }
      setPositions(newPositions);
    }
  }

  /**
   * Sets position of parent node, finds children and recursively calls function for each of them as parent.
   * @param {*} nodeId      Id of state
   * @param {*} allParents  Array of ids of all parents of this node
   * @param {*} minHeight   The Y value of the top of this node's height slide
   * @param {*} maxHeight   The Y value of the bottom of this node's height slide
   * @returns An array of nodes, each node represents the organised position of a state = {id, x (height in machine), y}
   */
  function organiseChildren(nodeId, allParents, minHeight, maxHeight) {

    const x = allParents.length;                                    // Store current level of node in machine for width multiplying
    const y = (maxHeight + minHeight) / 2;                          // Y = Centre of node's given y-axis slice
    const positionNode = { id: nodeId, position: { x: x, y: y } };  // Position node indicate node id and its fixed position

    const transitions = machine.states.find(state => state.id == nodeId).transitions;
    if (transitions.length == 0) { return [positionNode] } // Base case - no children.

    let currentChildren = []; // Array of node's children

    // For each child node, add to array if not self-pointing or pointing to parent
    transitions.forEach(transition => {
      const child = transition[1];

      // Don't explore transitions pointing to parents or self
      if (!(allParents.includes(child)) && child != nodeId) { currentChildren.push(child) }
    });

    // Base case - no valid children.
    if (currentChildren.length == 0) { return [positionNode] } // If this is a leaf node.

    // Length of child's y-axis slice (represented by min and max height) = parents / number of children
    const length = (maxHeight - minHeight) / currentChildren.length;

    let childrenNodes = []; // Children's position nodes

    // For each child, calculate the heights of their slice and push the nodes of their children.
    for (let index = 0; index < currentChildren.length; index++) {
      const child = currentChildren[index];

      // Parent's min height + slice per index of child (they are below each other)
      const childMinHeight = minHeight + (length * index);

      // Parent's max height - slice per reverse index (bottom of slice matches top)
      const childMaxHeight = maxHeight - (length * (currentChildren.length - 1 - index));

      // Push the position nodes of each child and its children with new calculated slice heights
      childrenNodes.push(...organiseChildren(child, [...allParents, nodeId], childMinHeight, childMaxHeight))
    }

    return [positionNode, ...childrenNodes] // Concatonate parent and children's position nodes into one array
  }

  /**
   * Handles all click events for Viewport
   * @param event of interaction
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
          setStartStateX(machine.startStateId);
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

  const depth = machine.retrieveDepth(); // Depth of machine

  // Renders Viewport - styles set here as WIDTH and HEIGHT are set constants.
  return <div data-testid={"Viewport"} id={"Viewport"}
    style={{
      width: WIDTH + "svw",
      height: HEIGHT + "svh",
      border: "solid 1.5px black",
      position: "fixed",
      backgroundColor: "white",
    }}
    ref={ref}
    onClick={(event) => handleClick(event)} >
    <Xwrapper>

      {/* Draw State Circles */}
      {circleArray.map(circle => {
        let position = positions.find((pos) => pos.id === circle.id).position; // If null, do not calculate fixed position.
        if (position != null) {
          const viewportDimensions = document.getElementById('Viewport').getBoundingClientRect(); // Get dimensions of Viewport.
          position = {
            // X = Proportion of viewport based on current level in tree + offset
            x: (position.x * (viewportDimensions.width / depth)) + (CIRCLE_RADIUS + 10),  
            // Y = Calulcated Y slice as a percentage of Viewport height + offset for centering
            y: (position.y * 0.01 * viewportDimensions.height) - (CIRCLE_RADIUS / 2 + 10)     
          }

          // Resolving out of bounds of Viewport for state circle positions
          if (position.x < 0) position.x = 0;
          if (position.x > viewportDimensions.width) position.x = viewportDimensions.width;
          if (position.y < 0) position.y = 0;
          if (position.y > viewportDimensions.height) position.y = viewportDimensions.height;
        }

        // Draw Circle
        return <StateCircle
          key={circle.id}
          machine={machine}
          setMachine={setMachine}
          id={circle.id}
          defaultX={circle.defaultX}
          defaultY={circle.defaultY}
          CIRCLE_RADIUS={CIRCLE_RADIUS}
          position={position}
          setStartStateX={setStartStateX}
        />
      })}

      {transitionArray}

      {/* Start State Arrow */}
      {startStateX != null ?
        <Xarrow
          data-testid={"start"}
          color="black"
          key={"start"}
          id={"start"}
          start={machine.startStateId}
          end={machine.startStateId}
          SVGcanvasStyle={{ left: startStateX - (CIRCLE_RADIUS * 1.3)}} // Formats start state arrow
          strokeWidth={2.5}
          startAnchor="left"
          endAnchor='right'
        /> : null}
    </Xwrapper>
  </div>
}