'use client'
import React from 'react';
import FSA from './FSA';
import { Viewport } from './components/Viewport';
import { useState } from "react";
import { InteractionWindow } from './components/InteractionWindow';

function App() {
  const [machine, setMachine] = useState(new FSA());
  // Creates a state for the machine, which may be updated during runtime
  const [circleArray, setCircleArray] = useState([]); // State array containing the JSX of every circle
  const [currentPositions, setCurrentPositions] = useState([]); // State array of all circles' current positions

  return ( // The JSX for the application
    <div data-testid="App" style={{ height: "100%", width: "100%" }}>
      <InteractionWindow
        machine={machine}
        setMachine={setMachine}
        circleArray={circleArray}
        setCircleArray={setCircleArray}
        currentPositions={currentPositions}
        setCurrentPositions={setCurrentPositions}
      />
      <Viewport
        machine={machine}
        setMachine={setMachine}
        circleArray={circleArray}
        setCircleArray={setCircleArray}
        currentPositions={currentPositions}
        setCurrentPositions={setCurrentPositions}
      />
    </div>
  );
};

export default App;

