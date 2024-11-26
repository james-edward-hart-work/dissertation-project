let machine;
import React from 'react';

export function addState(name) {
  machine.total++;

  return {
    total: machine.total,
    states: [...machine.states, // Spread operator, spreads contents of 'machine' into new array.
    {
      id: machine.total,
      name: name,
      transitions: [['input', 'start2']],
      accept: false
    }]
  }
}

export function updateStateName(id, name) {  

  return {
    total: machine.total,
    states: machine.states.map(state => state.id == id ? {
      id: state.id,
      name: name,
      transitions: state.transitions,
      accept: state.accept
    } : state)
  };
}

/**
 * Stores and maintains the FSA, handling all operations.
 * @returns 
 */
export const FSA = ({ machineObj, setMachine }) => {

  machine = machineObj;

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

