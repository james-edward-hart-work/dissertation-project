import { FSA } from "@components/FSA";
import { Viewport } from "@components/Viewport";
import { useState } from "react";

function App() {
  const [machine, setMachine] = useState([]);

  return (
    <div className="App">
      <Viewport machine={machine} setMachine={setMachine} />
      <FSA machine={machine} setMachine={setMachine} />
    </div>
  );
};

export default App;

