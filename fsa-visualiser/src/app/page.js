'use client'
import React from 'react';
import FSA from './FSA';
import { Viewport } from './components/Viewport';
import { useState } from "react";
import { InteractionWindow } from './components/InteractionWindow';

function App() {
  // Creates a state for the machine, which may be updated during runtime 
  const [machine, setMachine] = useState(new FSA(0));

  // Tracks whether the 'Organise FSA Layout' button has been pressed.
  const [organiseLayout, setOrganiseLayout] = useState(false);

  return ( // The JSX for the application
    <div data-testid="App" style={{ height: "100%", width: "100%" }}
      onContextMenu={(event) => event.preventDefault()}> {/*  Disables default right-click behaviour (browser drop downs) */}

      <Viewport machine={machine} setMachine={setMachine} organiseLayout={organiseLayout} setOrganiseLayout={setOrganiseLayout} />
      <InteractionWindow machine={machine} setOrganiseLayout={setOrganiseLayout} />
    </div>
  );
};

export default App;

