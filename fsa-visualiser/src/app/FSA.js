/**
 * Class for creating Finite State Automata Objects
 * Contains all logical manipulation of the application's FSA (Finite State Automaton)
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

  /**
   * Toggles whether the given state is an accept state
   * @param id of state
   * @returns the updated state machine
   */
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

  /**
   * Adds a transition to the machine
   * @param fromStateId Id of origin state
   * @param toStateId Id of destination state
   * @param input Letter for transition
   * @returns the updated state machine
   */
  addTransition(fromStateId, toStateId, input) {
    const index = this.states.findIndex(state => state.id === fromStateId);
    // Find index of the origin state

    // Add input and id of destination state to array of transitions.
    this.states[index].transitions =
      [...this.states[index].transitions, // Retrieves current value of the list of transitions.
      [input, toStateId]
      ];
    return this;
  }

  /**
   * Deletes a transition from the machine
   * @param fromStateId Id of origin state
   * @param toStateId Id of destination state
   * @returns the updated state machine
   */
  deleteTransition(fromStateId, toStateId) {
    const index = this.states.findIndex(state => state.id === fromStateId);

    this.states[index].transitions = this.states[index].transitions.filter(element => element[1] != toStateId);

    // Removes all transitions which point toward the destination state.
    return this;
  }

  /**
   * Changes the input letter for a transition
   * @param fromStateId Id of origin state
   * @param toStateId Id of destination state
   * @param newInput New letter for transition
   * @returns the updated state machine
   */
  changeTransitionInput(fromStateId, toStateId, newInput) {
    const stateIndex = this.states.findIndex(state => state.id === fromStateId); // Get from state index
    const transitionIndex = this.states[stateIndex].transitions.findIndex(transition => transition[1] === toStateId);
    // Get the index of the transition pointing towards the specified destination stateId

    this.states[stateIndex].transitions[transitionIndex][0] = newInput;
    return this;
  }

  /**
   * Sets the given state as the start state
   * @param stateId Id of state
   * @returns 
   */
  setStartState(stateId) {
    this.startStateId = stateId;
    return this;
  }

  /**
   * Calculates whether the machine is deterministic, nondeterministic or invalid
   * @returns a string stating the machine's type
   */
  status() {
    let invalid = false;
    // Invalid if machine has no start state or accept state or has no alphabet (no empty words)
    if (this.startStateId == "-1" || this.states.filter(state => state.accept == true).length == 0 || this.inputAlphabet().length == 0) {
      return "Invalid";
    }

    // If any transitions do not have an transition word = invalid
    this.states.forEach(state => {
      state.transitions.forEach(element => {
        if (element[0].trim() == "") {
          invalid = true;
        }
      });
    });

    if (invalid) {
      return "Invalid";
    }

    // Gathers all input characters from start state's transitions.
    const startState = this.states.find(state => state.id === this.startStateId);
    let startStateInputs = [];
    startState.transitions.forEach(transition => {
      let letters = transition[0].trim().split(",");
      letters.forEach(letter => {
        if (startStateInputs.includes(letter)) {
          return "Nondeterministic";
        }
        startStateInputs.push(letter);
      });
    });

    // Checks that each state contains a transition for each transition letter
    for (let i = 0; i < this.states.length; i++) { // State
      let state = this.states[i];
      let stateInputs = [];

      for (let j = 0; j < state.transitions.length; j++) { // Transition
        let letters = state.transitions[j][0].trim().split(",");

        for (let k = 0; k < letters.length; k++) { // Letters
          let letter = letters[k];

          // Nondeterministic if a state contains two transitions for the same letter
          // Or if it contains the empty word
          if (stateInputs.includes(letter) || letter == "ε") {
            return "Nondeterministic";
          }
          stateInputs.push(letter);
        }
      }

      // Nondeterminisitc if an input letter is missing from transitions.
      for (let l = 0; l < startStateInputs.length; l++) {
        if (stateInputs.filter(input => input == startStateInputs[l]).length !== 1) {
          return "Nondeterministic";
        }
      }
    }

    return "Deterministic";
  }

  /**
   * Runs an input word on the machine
   * @param inputWord Input word
   * @returns a boolean stating whether the word is accepted or not
   */
  runInput(inputWord) {

    // Checks if word is valid against input alphabet.
    if (this.status() == "Invalid") {
      alert("ERROR: Machine is not valid, please ensure it has:\n - A start state (selected using Alt + Shift + Click)\n - At least one accept state (toggled using double click)")
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
      alert("ERROR: Invalid word, the input word must only consist of characters within the machine's input alphabet:\n" + this.inputAlphabet());
      return;
    }

    // Checks if word is accepted by the machine.
    let currentState = this.states.find(state => state.id === this.startStateId);
    let outputPath = inputWord + ". Path: " + currentState.name;
    let isAccepted = false;

    if (this.status() == "Deterministic") { // Follows input word's letters to trace path
      // Move to final state.
      letters.forEach(letter => {
        outputPath += " => "
        let nextStateEntry = undefined;

        const allTransitions = currentState.transitions.filter(transition => transition[0] == letter);
        allTransitions.forEach(transition => { // For each transition
          const inputs = transition[0].trim().split(",");
          if (inputs.includes(letter)) { // Does the possible inputs for this transition contain the current letter
            nextStateEntry = transition; // Updates next state
          }
        });

        currentState = this.states.find(state => state.id === nextStateEntry[1]);
        outputPath += currentState.name;
      })

      if (currentState.accept) {
        alert("The machine accepts: " + outputPath);
      } else {
        alert("The machine rejects: " + outputPath);
      }

    } else { // Nondeterministic - Breathe-first Search of branching state transitions

      const startState = this.states.find(state => state.id === this.startStateId);
      let nodeStore = [[0, startState]]; // Array of nodes to visit (added upon indetifying a branch)
      // Nodes = [Index of letter, state]

      do {
        let node = nodeStore.shift();
        let letterIndex = node[0];
        let currentState = node[1];
        if (letterIndex == letters.length) { // Index will be the length of the word after final letter is ticked
          if (currentState.accept) {
            isAccepted = true;
            break; // Stop if found.
          } else {
            // If word is finished, check for transitions using empty word and navigate
            const emptyWordStates = currentState.transitions.filter(transition => transition[0] == "ε");
            emptyWordStates.forEach(transition => {
              if (transition[1] != currentState.id) {
                let state = this.states.find(state => state.id === transition[1])
                nodeStore.push([letterIndex, state]) // Same letter      
              }
            });
          }
        } else { // If not at the end of a word - navigate branch

          // Add all valid child states to queue.
          const childStates = currentState.transitions.filter(transition => transition[0] == inputWord[node[0]]);
          const emptyWordStates = currentState.transitions.filter(transition => transition[0] == "ε");

          // Push valid child states as a new node
          // Valid = has next letter in word or the empty word
          if (childStates != undefined) {
            childStates.forEach(transition => {
              let state = this.states.find(state => state.id === transition[1])
              nodeStore.push([letterIndex + 1, state]) // Increment letter index
            });
          }
          if (emptyWordStates != undefined) {
            emptyWordStates.forEach(transition => {
              if (transition[1] != currentState.id) {
                let state = this.states.find(state => state.id === transition[1])
                nodeStore.push([letterIndex, state]) // Same letter     
              }
            });
          }
        }
      } while (nodeStore.length > 0) // Keep traversing if there are nodes left

      if (isAccepted) {
        alert("The machine accepts: " + inputWord);
      } else {
        alert("The machine rejects: " + inputWord);
      }
    }

    return isAccepted;
  }

  /**
   * Calcualtes the input alphabet of the machine
   * @returns An array of all letters in the alphabet
   */
  inputAlphabet() {
    let inputs = [];

    // Add all unique transition letter for each state
    this.states.forEach(state => {
      state.transitions.forEach(element => {
        if (!inputs.includes(element[0]) && element[0] != "ε" && element[0].trim() != "") {
          inputs.push(element[0]);
        }
      });
    });
    return inputs;
  }

  // Returns an array of node's child nodes
  findChildren(nodeId, allParents) {

    allParents.push(nodeId);
    
    const transitions = this.states.find(state => state.id == nodeId).transitions;
    if (transitions.length == 0) { return null } // Base case = leaf node

    let currentChildren = []; // Array of node's children

    // Add all children to array.
    transitions.forEach(transition => {
      const child = transition[1];

      // Don't explore transitions pointing to parents or self
      if (!(allParents.includes(child))) { currentChildren.push(child) }
    });

    if (currentChildren.length == 0) { return null } // Base case = No valid children

    let diagram = [];
    // For each child, return a node of their id and array of children
    currentChildren.forEach(child => { diagram.push(child, this.findChildren(child, allParents)) });

    return diagram;
  }

  // Recursive algorithm to find depth of nested array: [parent, [array of children]]
  // Adapted from: https://dev.to/esaldivar/algorithm-approach-retrieve-depth-48fk [38]
  retrieveDepthFromArray (arr, depth = 1) {

    // If the array contains no nested arrays, return depth
    if (!arr.some(value => Array.isArray(value))) { return depth }

    // If nested arrays exist, flatten one level and recurse with depth incremented
    return this.retrieveDepthFromArray(arr.flat(), depth + 1);
  }

  // Calculate depth of machine.
  retrieveDepth() {
    if (this.startStateId == "-1") { return 0 }
    return this.retrieveDepthFromArray(
      // Build nested array representing topology of machine for depth check
      [this.startStateId, this.findChildren(this.startStateId, [this.startStateId])]
    );
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