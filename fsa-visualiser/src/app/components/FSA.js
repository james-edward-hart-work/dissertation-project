import React from 'react';
let machine; // Globally stores the finite state nmachine for application to perform operations on.

/**
 * Adds a state to the finite state machine
 * @param name of new state
 * @returns a new finite state machine with 
 * the new stated added onto the list of states
 */
export function addState(name) {
  machine.total++;

  return {
    total: machine.total,
    states: [...machine.states, // Retrieves current value of the list of states.
    {
      id: machine.total, // Id always unique as total only ever increments
      name: name,
      transitions: [['input', 'start2']], // Default transitions (to be changed later)
      accept: false // Default accept state, may be changed later
    }]
  }
}

/**
 * Updates the name of a specific state
 * @param id of state
 * @param name for state to be changed to
 * @returns the updated state machine
 */
export function updateStateName(id, name) {

  return {
    total: machine.total,
    states: machine.states.map( // Return new array with conditional statement applied to each entry
      state => state.id == id ? { // If state matches Id, return updated state.
        id: state.id,
        name: name,
        transitions: state.transitions,
        accept: state.accept
      }
        : state
    ) // If id does not match, return current entry in array.
  };
}

/**
 * Stores and maintains the FSA, handling all operations.
 * @returns a description of the machine
 */
export const FSA = ({ machineObj, setMachine }) => {

  machine = machineObj; 
  // Sets the default machine given from the application as the global machine for the class

  function printMachine() {
    let states = [];
    for (let index = 0; index < machine.states.length; index++)
      states.push(<p key={index}>{machine.states[index].name + ", [" + machine.states[index].transitions + "], " + machine.states[index].accept}</p>);
    return <div>{states}</div>;
  }

  return (<div>
    {printMachine()} <br></br>
  </div>);

}

