'use client'
import React from 'react';
import FSA from './FSA';
import { Viewport } from './components/Viewport';
import { useState } from "react";
import { InteractionWindow } from './components/InteractionWindow';

function App() {
  const [machine, setMachine] = useState(new FSA(0));
  // Creates a state for the machine, which may be updated during runtime

  // function updateMachine(func, {params}) {
  //   setMachine((machine) => {
  //     const newMachine = new FSA(machine);
  //     newMachine.func(params);
  //     return newMachine;
  //   })
  // }

  return ( // The JSX for the application
    <div data-testid="App" style={{ height: "100%", width: "100%" }}>
      <Viewport machine={machine} setMachine={setMachine} />
      <InteractionWindow machine={machine} />
    </div>
  );
};

export default App;

