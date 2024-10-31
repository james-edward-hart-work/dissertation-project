
export function addState(machine, name) {
  return [
    ...machine, // Spread operator, spreads contents of 'machine' into new array.
    {
      name: name,
      transitions: [['input', 'start2']],
      accept: false
    }];
}

/**
 * Stores and maintains the FSA, handling all operations.
 * @returns 
 */
export const FSA = ({machine, setMachine}) => {

  function printMachine() {
    let states = [];
    for (let index = 0; index < machine.length; index++)       
      states.push(<p key={index}>{machine[index].name + ", [" + machine[index].transitions + "], " + machine[index].accept}</p>);
    return <div>{states}</div>;
  }
  
  return (<div>
    {printMachine()} <br></br>
    <button onClick={() => setMachine(addState)}>Add State</button>
  </div>);

}

