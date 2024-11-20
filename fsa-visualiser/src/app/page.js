'use client'
import { FSA } from "./components/FSA";
import { Viewport } from "./components/Viewport";
import { useState } from "react";

const machineConfig = {
  total: 0,
  states: []
};

function App() {
  const [machine, setMachine] = useState(machineConfig);

  return (
    <div className="App">
      <Viewport machine={machine} setMachine={setMachine} />
      <FSA machineObj={machine} setMachine={setMachine} />
    </div>
  );
};

export default App;

