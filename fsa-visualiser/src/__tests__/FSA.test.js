import '@testing-library/jest-dom'
import FSA from '../app/FSA';

let machine = new FSA(0);

describe('FSA', () => {
  afterEach(() => machine = new FSA(0));
  test('Ensures FSA object constructs correctly', () => {
    expect(machine.total).toEqual(0);
    expect(machine.states).toEqual([]);
  })
  test('Adding 2 States to Machine', () => {

    machine.addState("State0");
    machine.addState("State1");

    expect(machine.total).toEqual(2);
    expect(machine.states).toEqual([
      { id: 0, name: "State0", transitions: [], accept: false },
      { id: 1, name: "State1", transitions: [], accept: false }
    ]);
  })
  test('State Name Update Functions ', () => {
    machine.addState("State0");
    machine.addState("State1");
    machine.addState("State2");

    machine.updateStateName(0, "NewName");
    machine.updateStateName(2, "NewName2");

    expect(machine.total).toEqual(3);
    expect(machine.states).toEqual([
      { id: 0, name: "NewName", transitions: [], accept: false },
      { id: 1, name: "State1", transitions: [], accept: false },
      { id: 2, name: "NewName2", transitions: [], accept: false }
    ]);
  })
  test('Deleting 2 States from Machine', () => {

    machine.addState("State0");
    machine.addState("State1");
    machine.addState("State2");

    machine.deleteState(1);
    expect(machine.states).toEqual([
      { id: 0, name: "State0", transitions: [], accept: false },
      { id: 2, name: "State2", transitions: [], accept: false }
    ]);
    expect(machine.total).toEqual(3); 
    expect(machine.states.length).toEqual(2); 
    // Still equals 3 as total tracks the total number of states ever added.
  })

  test('Machine Reset Functioning', () => {
    machine.addState("State0");
    machine.addState("State1");
    machine.addState("State2");
    expect(machine.total).toEqual(3); 
    expect(machine.states).toEqual([
      { id: 0, name: "State0", transitions: [], accept: false },
      { id: 1, name: "State1", transitions: [], accept: false },
      { id: 2, name: "State2", transitions: [], accept: false }
    ]);

    machine.reset();
    expect(machine.total).toEqual(0); 
    expect(machine.states).toEqual([]);
  })

  test('Updating Start State', () => {

    machine.addState("State0");
    machine.addState("State1");

    expect(machine.total).toEqual(2);
    expect(machine.states).toEqual([
      { id: 0, name: "State0", transitions: [], accept: false },
      { id: 1, name: "State1", transitions: [], accept: false }
    ]);
  })
})