/**
 * Class for creating Finite State Automata Objects
 * Contains all logical manipulation of the application's FSA
 */
class FSA {
  // Default configuration for the application's Finite State Machine
  constructor() {
    this.total = 0; // Tracks the total number of states ever created, not the current number of states
    this.states = []; // Array of state objects
  }

  /**
   * Adds a state to the finite state machine.
   * @param name of the new state
   * @returns the FSA object with the added state
   */
  addState(name) {
    this.states = [...this.states, // Retrieves current value of the list of states.
    {
      id: this.total , // Id always unique as total only ever increments
      name: name,
      transitions: [['input', 'nextState']], // Input word for transition, destination state
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

    this.states = this.states.map( // Return new array with conditional statement applied to each entry
      state => state.id == id ? { // If state matches Id, return updated state.
        id: state.id,
        name: name,
        transitions: state.transitions,
        accept: state.accept
      } : state
    ); // If id does not match, return current entry in array.

    return this;
  }

  /**
   * Resets FSA to default values.
   */
  reset() {
    total = 0;
    states = 0;
  }
}

export default FSA;