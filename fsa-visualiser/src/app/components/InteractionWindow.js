import { useState } from "react";
import styles from "../../styles/InteractionWindow.module.css"
import { InputBar } from "./InputBar";

// Following Dropdown component taken from: https://www.simplilearn.com/tutorials/reactjs-tutorial/how-to-create-functional-react-dropdown-menu
const Dropdown = ({ label, value, options, onChange }) => {
    return (
        <label>
            {label}
            <select value={value} onChange={onChange} data-testid={'Select'}>
                {options.map((option) => (
                    <option value={option.value} key={option.label}>{option.label}</option>
                ))}
            </select>
        </label>
    );
};
// End of taken code.

/**
 * Handles exporting of FSA (to be filled out later)
 * @param {*} type of export
 */
function exportDropDown(type) {
    alert('Exported: ' + type); // Placeholder for code
}

/**
 * Prints table of controls onto window
 * @returns JSX for Controls Table
 */
function printControls() {
    return <table className={styles.Controls} data-testid="Controls" >
        <tbody>
            <tr>
                <td>Click (Blank Space)</td>
                <td>Creates a new state</td>
            </tr>
            <tr>
                <td>Click (Transition)</td>
                <td>Toggles straightness of arrow</td>
            </tr>
            <tr>
                <td>Drag (State)</td>
                <td>Drags state to new posititon</td>
            </tr>
            <tr>
                <td>Shift + Click (State)</td>
                <td>Creates transition from selected state, then click on the destination state</td>
            </tr>
            <tr>
                <td>Alt + Click (State/Transition)</td>
                <td>Deletes state or transition</td>
            </tr>
            <tr>
                <td>Double Click (State)</td>
                <td>Toggles accept state</td>
            </tr>
            <tr>
                <td>Shift + Alt + Click (State)</td>
                <td>Makes selected state the start state</td>
            </tr>
        </tbody>
    </table>
}

/**
 * Prints a table of the FSA's states including it's name, transitions and whether it is an accept state.
 * @param {*} machine to be printed
 * @returns JSX for states table
 */
function printMachine(machine) {
    // Empty Machine
    if (machine.states.length == 0) {
        return <h3 className={styles.States}>No States Added.</h3>;
    }

    // Table Headers
    let states = [
        <tr key={'header'}>
            <th>State</th>
            <th>Transitions</th>
            <th style={{ width: "20%" }}>Accept?</th>
        </tr>
    ];

    // Fills table for each state
    machine.states.forEach((element, index) => {

        let transitions = [];
        for (let index = 0; index < element.transitions.length; index++) {
            const destName = machine.states.find(state => state.id === element.transitions[index][1]).name;
            transitions.push(<p key={element.name + "," + index}>{"[" + element.transitions[index][0] + " => " + destName + "]"}</p>)
        }

        states.push(
            <tr key={index}>
                <td>{(element.id == machine.startStateId) ? <b>{element.name}</b> : <p>{element.name}</p>}</td>
                <td>{transitions}</td>
                <td>{"" + element.accept}</td>
            </tr>
        );
    });
    return <div className={styles.States} data-testid="StatesList">
        <h3>Machine Description:</h3>
        {(machine.startStateId != -1) 
        ? <b style={{marginLeft: "2%"}}>Start State: {machine.states.find(state => state.id === machine.startStateId).name}</b>
        : <b style={{marginLeft: "2%"}}>No start state selected.</b>
        }
        <table><tbody>{states}</tbody></table>
    </div>;
}

/**
 * Function component for the Interaction Window on the right of the application.
 * Designed to aid FSA development and allow for exporting the FSA.
 * @param machine Application's FSA
 * @returns JSX for Interaction Window
 */
export const InteractionWindow = ({ machine }) => {

    const [hidePrint, setHidePrint] = useState(true); // Tracks if table of states is hidden or not
    const [hideControls, setControlsPrint] = useState(true); // Tracks if table of controls is hidden or not
    const [exportType, setExportType] = useState('PNG'); // Stores the type of desired export

    return <div className={styles.InteractionWindow} data-testid="InteractionWindow">

        <InputBar machine={machine} />
        <br></br>

        <button className={styles.OrganiseButton} data-testid="OrganiseButton" > Organise FSA Layout</button>
        <br></br>
        <br></br>

        {/* Export Drop Down */}
        {/* Following code adapted from: https://www.simplilearn.com/tutorials/reactjs-tutorial/how-to-create-functional-react-dropdown-menu */}
        <div data-testid="Dropdown">
            <Dropdown
                label="Select method of exporting your FSA: "
                options={[
                    { label: 'PNG', value: 'PNG' },
                    { label: 'SVG', value: 'SVG' },
                    { label: 'JSON', value: 'JSON' },
                    { label: 'LaTeX', value: 'LaTeX' },
                    { label: 'Video', value: 'Video' }
                ]}
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
            />
        </div>
        {/* End of adapted code */}
        <button onClick={() => exportDropDown(exportType)} data-testid="ExportButton">Export</button>
        <br></br>
        <br></br>

        {/* Controls */}
        {hideControls
            ? <button onClick={() => setControlsPrint(false)} data-testid="ControlsButton" >View Controls</button>
            : <div>
                <button onClick={() => setControlsPrint(true)} data-testid="ControlsButton" >Hide Controls</button>
                {printControls()}
                <p style={{ marginTop: "1%", marginLeft: "2%"}}>Empty Word Symbol: ε </p>
            </div>
        }
        <br></br>

        {/* List of States */}
        {hidePrint
            ? <button className={styles.StatesButton} onClick={() => setHidePrint(false)} data-testid="StatesButton" >View States</button>
            : <div>
                <button className={styles.StatesButton} onClick={() => setHidePrint(true)} data-testid="StatesButton" >Hide States</button>
                {printMachine(machine)}
            </div>
        }        
        <br></br>
    </div>;
}