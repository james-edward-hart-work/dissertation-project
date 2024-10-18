import { useState } from "react";

function printMachine (machine) {
  let string = "";
  machine.forEach(element => {
    string += element.name + ",";
  });
  return string;
}

const machineArray = [];
// For add state, push a new state object
// const state = {
//   name: 'start',
//   transitions: [['input', 'start2']],
//   accept: false
// };
// const state2 = {
//   name: 'start2',
//   transitions: [['input', 'start']],
//   accept: true
// };

export const FSA = () => {
  const [machine, setMachine] = useState(machineArray);

  // machine.push({
  //   name: 'start',
  //   transitions: [['input', 'start2']],
  //   accept: false
  // })

  function addState(){
    machineArray.push({
      name: 'start' + machineArray.length,
      transitions: [['input', 'start2']],
      accept: false
    });
    console.log(machine);
    return machineArray;
  }

  return (<div>
    {printMachine(machine)} <br></br>
    <button onClick={() => setMachine(addState())}></button></div>);

}

