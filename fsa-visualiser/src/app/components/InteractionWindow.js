import { useState } from "react";
import styles from "../../styles/InteractionWindow.module.css"

// Following Dropdown component taken from: https://www.simplilearn.com/tutorials/reactjs-tutorial/how-to-create-functional-react-dropdown-menu
const Dropdown = ({ label, value, options, onChange }) => {
    return (
        <label>
            {label}
            <select value={value} onChange={onChange}>
                {options.map((option) => (
                    <option value={option.value} key={option.label}>{option.label}</option>
                ))}
            </select>
        </label>
    );
};
// End of taken code.

function exportDropDown(type) {
    console.log(type);
}

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
            <th style={{ width: "20%" }}>Accept?</th>
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

    const [hidePrint, setHidePrint] = useState(true); // Tracks if table of states is hidden or not
    const [hideControls, setControlsPrint] = useState(true); // Tracks if table of controls is hidden or not
    const [showPlay, setShowPlay] = useState(true); // Tracks if play or stop button is shown
    const [exportType, setExportType] = useState('None'); // Stores the type of desired export
    const [validFSA, setValidFSA] = useState(true); // Tracks whether the current FSA is valid or not
    let lightColour = "green";
    if (validFSA == false) {
        lightColour = "red";
    }

    return <div className={styles.InteractionWindow}>

        {/* Word Input */}
        <div className={styles.InputDiv}>
            <input className={styles.WordInput} placeholder="Enter an input word..."></input>
            {showPlay
                ? <span className={styles.PlayButton} onClick={() => setShowPlay(false)}>&#9655;</span>
                : <span className={styles.StopButton} onClick={() => setShowPlay(true)}>&#9723;</span>
            }
            <span className={styles.ValidLight} style={{ backgroundColor: lightColour }}></span>
        </div>
        <br></br>

        <button className={styles.OrganiseButton}> Organise FSA Layout</button>
        <br></br>
        <br></br>

        {/* Export Drop Down */}
        {/* Following code adapted from: https://www.simplilearn.com/tutorials/reactjs-tutorial/how-to-create-functional-react-dropdown-menu */}
        <div>
            <Dropdown
                label="Select method of exporting your FSA: "
                options={[
                    { label: 'PNG', value: 'PNG' },
                    { label: 'SVG', value: 'SVG' },
                    { label: 'LaTex', value: 'LaTex' },
                    { label: 'Video', value: 'Video' }
                ]}
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
            />
        </div>
        {/* End of adapted code */}
        <button onClick={() => exportDropDown(exportType)}>Export</button>
        <br></br>
        <br></br>

        {/* List of States */}
        {hidePrint
            ? <button className={styles.StatesButton} onClick={() => setHidePrint(false)}>View States</button>
            : <div>
                <button className={styles.StatesButton} onClick={() => setHidePrint(true)}>Hide States</button>
                {printMachine(machine)}
            </div>
        }
        <br></br>
        <br></br>

        {/* Controls */}
        {hideControls
            ? <button onClick={() => setControlsPrint(false)}>View Controls</button>
            : <div>
                <button onClick={() => setControlsPrint(true)}>Hide Controls</button>
                {printControls()}
            </div>
        }
    </div>;
}