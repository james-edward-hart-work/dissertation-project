import { useState } from "react";
import styles from "../../styles/InteractionWindow.module.css"
import { InputBar } from "./InputBar";
import * as htmlToImage from 'html-to-image';
import FSA from "../FSA";

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
 * Prints table of controls onto window
 * @returns JSX for Controls Table
 */
function printControls() {
    return <div className={styles.Controls} data-testid="Controls" >
        <br></br>

        <b>Double Click (Blank Space)</b>
        <p>Creates a new state.<br></br>(drag to move)</p>

        <b>Shift + Click (State)</b>
        <p>Creates a transition arrow between two states:<br></br>First - Selects origin state<br></br>Second - Selects desintation state</p>

        <b>Alt + Click (State or Transition)</b>
        <p>Deletes the selected state or transition.</p>

        <b>Double Click (State)</b>
        <p>Toggles the accept status of the selected state.</p>

        <b>Control + Click (State)</b>
        <p>Makes the selected state the start state.</p>

    </div>
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
            <th style={{ width: "30%" }}>Accept?</th>
        </tr>
    ];

    // Fills table for each state
    const newMachine = new FSA(machine);
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
        {(machine.startStateId != -1)
            ? <b style={{ marginLeft: "2%" }}>Start State: {machine.states.find(state => state.id === machine.startStateId).name}</b>
            : <b style={{ marginLeft: "2%" }}>No start state selected.</b>
        }
        <table><tbody>{states}</tbody></table>
    </div>;
}

/**
 * Handles exporting of the user's finite state diagram.
 * @param type of export
 */
function exportDropDown(type, machine) {

    const downloadExport = (dataUrl, type) => {
        const downloadLink = document.createElement('a');
        const fileName = 'MyFSA.' + type;

        downloadLink.href = dataUrl;
        downloadLink.download = fileName;
        downloadLink.click();
    };

    if (machine.status() == "Invalid") {
        if (!confirm("WARNING: Your machine is invalid. Click 'OK' to continue exporting or 'cancel' to cancel."))
            return;
    }

    switch (type) {
        // PNG and SVG styles below ensure Viewport is at root when exporting.
        case "PNG":
            htmlToImage
                .toPng(document.getElementById('Viewport'), { style: { transform: "translate(-0.7%, -1%)" } })
                .then((dataUrl) => downloadExport(dataUrl, "png"));
            break;

        case "SVG":
            htmlToImage
                .toSvg(document.getElementById('Viewport'), { style: { transform: "translate(-0.7%, -1%)" } })
                .then((dataUrl) => downloadExport(dataUrl, "svg"));
            break;

        case "JSON":
            const jsonData = JSON.stringify(machine, null, 2); // Converts JSON data into JSON string, 2 is for intendation spaces
            const blob = new Blob([jsonData], { type: "application/json" }); // Creates data blob to be attached to URL
            const url = URL.createObjectURL(blob);
            downloadExport(url, "json");
            URL.revokeObjectURL(url); // Removes object URL for cleanup
            break;

        default:
            break;
    }
}

/**
 * Function component for the Interaction Window on the right of the application.
 * Designed to aid FSA development and allow for exporting the FSA.
 * @param machine Application's FSA
 * @param setOrganiseLayout Setter for organiseLayout
 * @returns JSX for Interaction Window
 */
export const InteractionWindow = ({ machine, setMachine, setOrganiseLayout }) => {

    const [hidePrint, setHidePrint] = useState(true); // Tracks if table of states is hidden or not
    const [hideControls, setControlsPrint] = useState(true); // Tracks if table of controls is hidden or not
    const [exportType, setExportType] = useState('PNG'); // Stores the type of desired export

    return <div className={styles.InteractionWindow} data-testid="InteractionWindow">
        <InputBar machine={machine} />

        {/* Export Drop Down */}
        {/* Following code adapted from: https://www.simplilearn.com/tutorials/reactjs-tutorial/how-to-create-functional-react-dropdown-menu */}
        <div data-testid="Dropdown">
            <Dropdown
                label="Export your FSA: "
                options={[
                    { label: 'PNG', value: 'PNG' },
                    { label: 'SVG', value: 'SVG' },
                    { label: 'JSON', value: 'JSON' },
                    // { label: 'LaTeX', value: 'LaTeX' },
                    // { label: 'Video', value: 'Video' }
                ]}
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
            />

            {/* End of adapted code */}
            <button style={{ marginLeft: "2%" }} onClick={() => exportDropDown(exportType, machine)} data-testid="ExportButton">Export</button>
        </div>
        <br></br>

        {/* Organise Layout */}
        <button className={styles.Button} data-testid="OrganiseButton" onClick={() => setOrganiseLayout(true)}> Organise FSA Layout</button>
        <br></br>
        <br></br>

        {/* Controls */}
        {hideControls
            ? <div><button className={styles.Button} onClick={() => setControlsPrint(false)} data-testid="ControlsButton" >View Hotkey Controls</button><br></br></div>
            : <div>
                <button className={styles.Button} onClick={() => setControlsPrint(true)} data-testid="ControlsButton" >Hide Hotkey Controls</button>
                <br></br>

                {printControls()}
                <b style={{ marginTop: "1%", marginLeft: "2%" }}>Note: Alt key = 'option' (on Macbooks)</b>
                <p style={{ marginTop: "1%", marginLeft: "2%" }}>Any state names or transition inputs can be changed.</p>
            </div>
        }
        <br></br>

        {/* List of States */}
        {hidePrint
            ? <button className={styles.Button} onClick={() => setHidePrint(false)} data-testid="StatesButton" >View Machine Description</button>
            : <div>
                <button className={styles.Button} onClick={() => setHidePrint(true)} data-testid="StatesButton" >Hide Machine Description</button>
                {printMachine(machine, setMachine)}
            </div>
        }
        <br></br>
    </div>;
}