import '@testing-library/jest-dom'
import FSA from '../app/FSA';

let machine = new FSA(0);
let validMachine = new FSA({
  startStateId: "0",
  states:
    [{ id: "0", name: "Start_State", transitions: [["a", "1"], ["b", "0"]], accept: false },
    { id: "1", name: "State1", transitions: [], accept: true }],
  total: 2
});

// Test Suite for FSA.js
describe('FSA', () => {
  afterEach(() => {
    machine = new FSA(0)
    validMachine = new FSA({
      startStateId: "0",
      states:
        [{ id: "0", name: "Start_State", transitions: [["a", "1"], ["b", "0"]], accept: false },
        { id: "1", name: "State1", transitions: [], accept: true }],
      total: 2
    });
  });
  test('Ensures FSA object constructs correctly - New', () => {
    expect(machine.total).toEqual(0);
    expect(machine.states).toEqual([]);
  })
  test('Ensures FSA object constructs correctly - Replaced', () => {
    let validMachine = new FSA({
      startStateId: "0",
      states:
        [{ id: "0", name: "Start_State", transitions: [["a", "1"], ["b", "0"]], accept: false },
        { id: "1", name: "State1", transitions: [], accept: true }],
      total: 2
    });
    expect(validMachine.total).toEqual(2);
    expect(validMachine.states).toEqual([{ id: "0", name: "Start_State", transitions: [["a", "1"], ["b", "0"]], accept: false },
    { id: "1", name: "State1", transitions: [], accept: true }]);
  })
  test('Adding 2 States to Machine', () => {

    machine.addState("State0");
    machine.addState("State1");

    expect(machine.total).toEqual(2);
    expect(machine.states).toEqual([
      { id: "0", name: "State0", transitions: [], accept: false },
      { id: "1", name: "State1", transitions: [], accept: false }
    ]);
  })
  test('State Name Update Functions ', () => {
    machine.addState("State0");
    machine.addState("State1");
    machine.addState("State2");

    machine.updateStateName("0", "NewName");
    machine.updateStateName("2", "NewName2");

    expect(machine.total).toEqual(3);
    expect(machine.states).toEqual([
      { id: "0", name: "NewName", transitions: [], accept: false },
      { id: "1", name: "State1", transitions: [], accept: false },
      { id: "2", name: "NewName2", transitions: [], accept: false }
    ]);
  })
  test('Deleting 2 States from Machine', () => {

    machine.addState("State0");
    machine.addState("State1");
    machine.addState("State2");

    machine.deleteState(1);
    expect(machine.states).toEqual([
      { id: "0", name: "State0", transitions: [], accept: false },
      { id: "2", name: "State2", transitions: [], accept: false }
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
      { id: "0", name: "State0", transitions: [], accept: false },
      { id: "1", name: "State1", transitions: [], accept: false },
      { id: "2", name: "State2", transitions: [], accept: false }
    ]);

    machine = new FSA(0);
    expect(machine.total).toEqual(0);
    expect(machine.states).toEqual([]);
  })

  test('Updating Start State', () => {

    machine.addState("State0");
    machine.addState("State1");

    expect(machine.total).toEqual(2);
    expect(machine.states).toEqual([
      { id: "0", name: "State0", transitions: [], accept: false },
      { id: "1", name: "State1", transitions: [], accept: false }
    ]);
  })
  test('Toggle Accept', () => {

    machine.addState("State0");
    machine.addState("State1");

    machine.toggleAccept("1")

    expect(machine.states).toEqual([
      { id: "0", name: "State0", transitions: [], accept: false },
      { id: "1", name: "State1", transitions: [], accept: true }
    ]);
  })

  test('Set Start State', () => {
    expect(machine.startStateId).toEqual("-1");

    machine.addState("State0");
    machine.addState("State1");

    machine.setStartState("0")

    expect(machine.startStateId).toEqual("0");
  })

  test('Add Transition', () => {
    machine.addState("State0");
    machine.addState("State1");
    machine.setStartState("0")
    machine.addTransition("0", "1", "a")

    expect(machine.states[0].transitions.length).toEqual(1);
    expect(machine.states[0].transitions).toEqual([["a", "1"]]);
  })

  test('Delete Transition', () => {
    machine.addState("State0");
    machine.addState("State1");
    machine.setStartState("0")
    machine.addTransition("0", "1", "a")
    machine.addTransition("1", "0", "b")

    expect(machine.states[0].transitions.length).toEqual(1);
    expect(machine.states[0].transitions).toEqual([["a", "1"]]);
    expect(machine.states[1].transitions.length).toEqual(1);
    expect(machine.states[1].transitions).toEqual([["b", "0"]]);

    machine.deleteTransition("0", "1")

    expect(machine.states[0].transitions.length).toEqual(0);
    expect(machine.states[0].transitions).toEqual([]);
    expect(machine.states[1].transitions).toEqual([["b", "0"]]);
  })

  test('Change Transition Input', () => {
    machine.addState("State0");
    machine.addState("State1");
    machine.setStartState("0")
    machine.addTransition("0", "1", "a")

    expect(machine.states[0].transitions.length).toEqual(1);
    expect(machine.states[0].transitions).toEqual([["a", "1"]]);

    machine.changeTransitionInput("0", "1", "b")
    expect(machine.states[0].transitions.length).toEqual(1);
    expect(machine.states[0].transitions).toEqual([["b", "1"]]);
  })

  test('Machine Status', () => {
    machine.addState("State0");
    machine.addState("State1");
    machine.setStartState("0")
    machine.addTransition("0", "1", "a")

    expect(machine.status()).toEqual("Invalid");

    machine.toggleAccept("1")
    expect(machine.status()).toEqual("Nondeterministic");

    machine.addTransition("1", "1", "a")
    expect(machine.status()).toEqual("Deterministic");

    machine.addTransition("1", "0", "ε")
    expect(machine.status()).toEqual("Nondeterministic");

    machine.addTransition("0", "0", "a")
    expect(machine.status()).toEqual("Nondeterministic");

    machine.addTransition("0", "0", "")
    expect(machine.status()).toEqual("Invalid");

    let empty = new FSA(0)
    empty.addState("State0")
    empty.setStartState("0")
    expect(empty.status()).toEqual("Invalid");
    
  })

  describe('InteractionWindow', () => {

    beforeEach(() => {
      global.alert = jest.fn();
    });

    test('Run Input - Accept', () => {
      validMachine.runInput("a")
      expect(global.alert).toHaveBeenCalledWith("The machine accepts: a.\nPath: Start_State => State1.")

      validMachine.addTransition("1", "0", "b")
      validMachine.addTransition("1", "1", "a")
      validMachine.runInput("a")
      expect(global.alert).toHaveBeenCalledWith("The machine accepts: a.\nPath: Start_State => State1.")
    })

    test('Run Input - Reject Normal Nondeterministic', () => {
      validMachine.runInput("ab")
      expect(global.alert).toHaveBeenCalledWith("The machine rejects: ab")
    })

    test('Run Input - Nondeterministic with Empty Word', () => {
      validMachine.addTransition("0", "1", "ε")
      validMachine.runInput("b")
      expect(global.alert).toHaveBeenCalledWith("The machine accepts: b.\nPath: Start_State => Start_State => State1.")
    })

    test('Run Input - Reject Deterministic', () => {
      validMachine.addTransition("1", "0", "b")
      validMachine.addTransition("1", "1", "a")
      validMachine.runInput("ab")
      expect(global.alert).toHaveBeenCalledWith("The machine rejects: ab.\nPath: Start_State => State1 => Start_State")
    })

    test('Run Input - Invalid', () => {
      let newMachine = new FSA(0)
      newMachine.runInput("a")
      expect(global.alert).toHaveBeenCalledWith("ERROR: Machine is not valid, please ensure it has:\n - A start state (selected using Alt + Shift + Click)\n - At least one accept state (toggled using double click)")

      validMachine.runInput("c")
      expect(global.alert).toHaveBeenCalledWith("ERROR: Invalid word, the input word must only consist of characters within the machine's input alphabet:\na,b")
    })
  })
})