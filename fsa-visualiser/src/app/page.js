'use client'
import React from 'react';
import { FSA } from './components/FSA';
import { Viewport } from './components/Viewport';
import { useState } from "react";

// Default configuration for the application's Finite State Machine
const machineConfig = {
  total: 0,
  states: []
};

function App() {
  const [machine, setMachine] = useState(machineConfig); 
  // Creates a state for the machine, which may be updated during runtime

  return ( // The JSX for the application
    <div className="App">
      <Viewport machine={machine} setMachine={setMachine} />
      <FSA machineObj={machine} setMachine={setMachine} />
      <button />
    </div>
  );
};

export default App;

