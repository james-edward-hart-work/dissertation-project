import { useState } from "react";

/**
 * Stores and maintains the FSA, handling all operations.
 * @returns 
 */
export const FSA = () => {
  const [machine, setMachine] = useState([]);

  let string = "";
  for (let index = 0; index < machine.length; index++) {
    string += machine[index].name + ",";
    console.log(machine[index].name);
  }

  function addState() {
    return [
      ...machine, // Spread operator, spreads contents of 'machine' into new array.
      {
        name: 'start' + machine.length,
        transitions: [['input', 'start2']],
        accept: false
      }];
  }

  return (<div>
    <p>{string}</p> <br></br>
    <button onClick={() => setMachine(addState)}>Add State</button>
  </div>);

}

