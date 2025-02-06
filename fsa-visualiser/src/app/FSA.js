import { input } from "@testing-library/user-event/dist/cjs/event/input.js";

/**
 * Class for creating Finite State Automata Objects
 * Contains all logical manipulation of the application's FSA
 */
class FSA {
  // Default configuration for the application's Finite State Machine

  constructor(machine) {
    if (machine === 0) {
      this.total = 0; // Tracks the total number of states ever created, not the current number of states
      this.states = []; // Array of state objects
      this.startStateId = "-1"; // Id of the start state, -1 for none
    } else { // Copy given machine;
      this.total = machine.total;
      this.states = [...machine.states.map(state => ({ ...state }))];
      this.startStateId = machine.startStateId + "";
    }
  }

  // STATES //

  /**
   * Adds a state to the finite state machine.
   * @param name of the new state
   * @returns the FSA object with the added state
   */
  addState(name) {
    this.states = [...this.states, // Retrieves current value of the list of states.
    {
      id: this.total + "", // Id always unique as total only ever increments
      name: name,
      transitions: [], // Input word for transition, destination state
      accept: false // Boolean for whether this is an accept state
    }];
    this.total++; // Increase total number of states created.
    return this;
  }

  /**
   * Deletes a specified state from the FSA
   * @param {*} id of state
   * @returns the machine with the removed state
   */
  deleteState(id) {
    // Do not decrement machine total as this tracks 
    // the total number of states ever added.
    this.states = this.states.filter(element => element.id != id);
    // Retreive all states which do not have the specified id value.
    return this;
  }

  /**
   * Updates the name of a specific state
   * @param id of state
   * @param name for state to be changed to
   * @returns the updated state machine
   */
  updateStateName(id, name) {
    // Update name of state with matching id in state array.
    const index = this.states.findIndex(state => state.id === id);
    this.states[index] = {
      id: id,
      name: name,
      transitions: this.states[index].transitions,
      accept: this.states[index].accept
    }
    return this;
  }

  toggleAccept(id) {
    // Update accept of state with matching id in state array.
    const index = this.states.findIndex(state => state.id === id);
    this.states[index] = {
      id: id,
      name: this.states[index].name,
      transitions: this.states[index].transitions,
      accept: !this.states[index].accept
    }
    return this;
  }

  // TRANSITIONS //

  addTransition(fromStateId, toStateId, input) {
    const index = this.states.findIndex(state => state.id === fromStateId);
    // Find index of the 'from' state

    // Add input and id of destination state to array of transitions.
    this.states[index].transitions =
      [...this.states[index].transitions, // Retrieves current value of the list of transitions.
      [input, toStateId]
      ];
    return this;
  }

  deleteTransition(fromStateId, toStateId) {
    const index = this.states.findIndex(state => state.id === fromStateId);

    this.states[index].transitions = this.states[index].transitions.filter(element => element[1] != toStateId);

    // Removes all transitions which point toward the destination state.
    return this;
  }

  changeTransitionInput(fromStateId, toStateId, newInput) {
    const stateIndex = this.states.findIndex(state => state.id === fromStateId); // Get from state index
    const transitionIndex = this.states[stateIndex].transitions.findIndex(transition => transition[1] === toStateId);
    // Get the index of the transition pointing towards the specified destination stateId

    this.states[stateIndex].transitions[transitionIndex][0] = newInput;
    return this;
  }

  setStartState(stateId) {
    this.startStateId = stateId;
    return this;
  }

  // To be filled out later
  status() {
    if (this.startStateId == "-1" || this.states.filter(state => state.accept == true).length == 0) {
      return "Invalid";
    }

    // Gathers all input characters from start state.
    const startState = this.states.find(state => state.id === this.startStateId);
    let startStateInputs = [];
    startState.transitions.forEach(transition => {
      let letters = transition[0].trim().split(",");
      letters.forEach(letter => {
        if (letter == "") {
          return;
        }
        if (startStateInputs.includes(letter)) {
          return "Nondeterministic";
        }
        startStateInputs.push(letter);
      });
    });

    if (startStateInputs.length == 0 && startState.accept == false) {
      return "Invalid";
    }

    // 
    for (let i = 0; i < this.states.length; i++) { // State
      let state = this.states[i];
      let stateInputs = [];

      for (let j = 0; j < state.transitions.length; j++) { // Transition
        let letters = state.transitions[j][0].trim().split(",");

        for (let k = 0; k < letters.length; k++) { // Letters
          let letter = letters[k];

          // Ensures state has no duplicate inputs or empty words
          if (stateInputs.includes(letter) || letter == "ε") {
            return "Nondeterministic";
          }
          stateInputs.push(letter);
        }
      }

      // Checks that the state is not missing any input values.
      for (let l = 0; l < startStateInputs.length; l++) {
        if (stateInputs.filter(input => input == startStateInputs[l]).length !== 1) {
          return "Nondeterministic";
        }
      }
    }

    return "Deterministic";
  }

  runInput(inputWord) {

    if (this.status() == "Invalid") {
      alert("Machine is not valid, please ensure it has:\n - A start state, selected using Alt + Shift + Click\n At least one accept state, toggled using double click.")
      return;
    }

    const letters = inputWord.split("");

    // Check that word is valid.
    let valid = true;
    letters.forEach(letter => {
      if (!this.inputAlphabet().includes(letter)) {
        valid = false;
      }
    });
    if (!valid) {
      alert("Invalid word");
      return;
    }

    let currentState = this.states.find(state => state.id === this.startStateId);
    let outputPath = inputWord + ". \nPath: " + currentState.name;

    if (this.status() == "Deterministic") { // Follows letters
      // Move to final state.
      letters.forEach(letter => {
        outputPath += " => "
        let nextStateEntry = undefined;

        const allTransitions = currentState.transitions.filter(transition => transition[0] == letter);
        allTransitions.forEach(transition => {
          const inputs = transition[0].trim().split(",");
          if (inputs.includes(letter)) {
            nextStateEntry = transition;
          }
        });

        if (nextStateEntry == undefined) {
          outputPath += "undefined";
          return;
        }

        currentState = this.states.find(state => state.id === nextStateEntry[1]);
        outputPath += currentState.name;
      })

      if (currentState.accept && !outputPath.endsWith("undefined")) {
        alert("The machine accepts: " + outputPath);
      } else {
        alert("The machine rejects: " + outputPath);
      }
    } else { // Nondeterministic - Depth-first Search

      // Same but:
      // - need to track choices and jump back when failing to most recent 'choice'
      // - empty words count as 'choices' but do not remove a letter

      // Ends when solution is found or call back stack is empty
      // ^ only for i loops

      let isValid = false;
      let branchStore = [[0, this.startStateId]]; // Array of branches to explore
      // [letterInded, destinationStateId]

      // Stores the fromState, toState and index of letter in word
      // If not more transitions, go through this list, end when this ends.
      // Pop branch each time exploring.

      while (branchStore.length > 0) { // Every loop = branch
        console.log(branchStore);

        const branch = branchStore.pop();
        currentState = this.states.find(state => state.id == branch[1]);
        let letterIndex = branch[0]; // Tracks index of current letter starting at branch
        if (letterIndex == inputWord.length) { // Branch is at end of word
          console.log("Word read fully");
          if (currentState.accept) { // Final state is an accept state.
            console.log("Accept");

            isValid = true;
            break;
          }
        } else { 
          // Change depth-first search to breathe-first
          // Not at final letter of input word.
          while (letterIndex != inputWord.length) {
            console.log("Branch: ", currentState.name, inputWord[letterIndex]);

            const possibleTransitions = currentState.transitions.filter(transition => (transition[0] == inputWord[letterIndex] || transition[0] == "ε"));
            console.log(possibleTransitions);

            if (possibleTransitions.length == 0) { // Branch ends before all letters are read.
              console.log("undef");
              break; // End current branch.
            }
            if (possibleTransitions.length > 1) { // If more than one choice can be made.
              for (let index = 1; index < possibleTransitions.length; index++) {
                if (possibleTransitions[0] == "ε") {
                  branchStore.push([letterIndex, possibleTransitions[index][1]]); // Letter at next state is the same.
                }
                branchStore.push([letterIndex + 1, possibleTransitions[index][1]]); // Letter at next state is different.
                // Add all possible branches to stack.
              }
            }
            currentState = this.states.find(state => state.id == possibleTransitions[0][1]); // Get next state
            if (possibleTransitions[0][0] != "ε") { // Increment letter index if not the empty word
              letterIndex++;
            }
            console.log(currentState);
            console.log(letterIndex);

          }
          console.log(currentState.name);

          // Letter is not the final letter
          if (currentState.accept) { // Final state is an accept state in this branch
            isValid = true;
            break;
          }
        }
      }

      if (isValid) {
        alert("The machine accepts: " + inputWord);
      } else {
        alert("The machine rejects: " + inputWord);
      }
    }
  }

  inputAlphabet() {
    // Deterministic - count all inputs for start state
    let inputs = [];
    if (this.status() == "Deterministic") {
      let startState = this.states.find(state => state.id === this.startStateId);
      startState.transitions.forEach(element => {
        if (!inputs.includes(element[0])) {
          inputs.push(element[0]);
        }
      });
    } else if (this.status() == "Nondeterministic") {
      this.states.forEach(state => {
        state.transitions.forEach(element => {
          if (!inputs.includes(element[0])) {
            inputs.push(element[0]);
          }
        });
      });

    }
    return inputs;
  }

  /**
   * Resets FSA to default values.
   */
  reset() {
    this.total = 0;
    this.states = [];
    this.startStateId = "-1";
  }
}

export default FSA;