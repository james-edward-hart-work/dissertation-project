'use client'
import React from 'react';
import FSA from './FSA';
import { Viewport } from './components/Viewport';
import { useState } from "react";

function App() {
  const [machine, setMachine] = useState(new FSA()); 
  // Creates a state for the machine, which may be updated during runtime
  
  return ( // The JSX for the application
    <div className="App">
      <Viewport machine={machine} setMachine={setMachine} />
      <button />
    </div>
  );
};

export default App;

