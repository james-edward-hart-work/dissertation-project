'use client'
import React from 'react';
import FSA from './FSA';
import { Viewport } from './components/Viewport';
import { useState } from "react";
import { InteractionWindow } from './components/InteractionWindow';

function App() {
  const [machine, setMachine] = useState(new FSA(0));
  const [organiseLayout, setOrganiseLayout] = useState(false);
  // Creates a state for the machine, which may be updated during runtime 

  return ( // The JSX for the application
    <div data-testid="App" style={{ height: "100%", width: "100%" }}>
        <Viewport machine={machine} setMachine={setMachine} organiseLayout={organiseLayout} setOrganiseLayout={setOrganiseLayout}/>
        <InteractionWindow machine={machine} setOrganiseLayout={setOrganiseLayout} />
    </div>
  );
};

export default App;

