import { useState } from "react";
import styles from "../../styles/InteractionWindow.module.css"

// Add drop down for exporting - SVG, PNG, Latex Code (popup + copy button), video of input
// Add play and stop button (check online), next to input
// Add green/red light for valid fsa or not
// Add list of click controls - DONE
// Add button to open text editor
// Include list of all states - DONE

function printControls() {
    return <table className={styles.Controls}>
        <tr>
            <td>Click (On Blank Space)</td>
            <td>Creates a new state</td>
        </tr>
        <tr>
            <td>Drag</td>
            <td>Drags state to new posititon</td>
        </tr>
        <tr>
            <td>Shift + Click</td>
            <td>Creates transition from selected state</td>
        </tr>
        <tr>
            <td>Alt + Click</td>
            <td>Deletes state</td>
        </tr>
        <tr>
            <td>Double Click</td>
            <td>Toggles accept state</td>
        </tr>
        <tr>
            <td>Triple Click</td>
            <td>Makes selected state the start state</td>
        </tr>
    </table>
}

function printMachine(machine) {
    if (machine.states.length == 0) {
       return <h3 className={styles.States}>No States Added.</h3>;
    }

    let states = [
        <tr>
            <th>Name</th>
            <th>Transitions</th>
            <th style={{width: "20%"}}>Accept?</th>
        </tr>
    ];
    machine.states.forEach((element) => {

        let transitions = [];
        for (let index = 0; index < element.transitions.length; index++) {
            transitions.push(<p>{"[" + element.transitions[index][0] + " => " + element.transitions[index][1] + "]"}</p>)
        }

        states.push(
            <tr>
                <td>{element.name}</td>
                <td>{transitions}</td>
                <td>{"" + element.accept}</td>
            </tr>
        );
    });
    return <div className={styles.States}>
        <h3>States:</h3>
        <table>{states}</table>
    </div>;
}


export const InteractionWindow = ({ machine, setMachine, circleArray, setCircleArray, currentPositions, setCurrentPositions }) => {

    const [hidePrint, setHidePrint] = useState(true);
    const [hideControls, setControlsPrint] = useState(true);

    return <div className={styles.InteractionWindow}>
        <button>Organise FSA Layout</button>
        <br></br>
        <input className={styles.WordInput} placeholder="Enter an input word..."></input>
        <br></br>

        {hidePrint ? <button onClick={() => setHidePrint(false)}>View States</button>
            : <div>
                <button onClick={() => setHidePrint(true)}>Hide States</button>
                {printMachine(machine)}
            </div>
        }
        <br></br>
        {hideControls ? <button onClick={() => setControlsPrint(false)}>View Controls</button>
            : <div>
                <button onClick={() => setControlsPrint(true)}>Hide Controls</button>
                {printControls()}
            </div>
        }
    </div>;
}