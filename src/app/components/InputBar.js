import { useState } from "react";
import styles from "../../styles/InputBar.module.css"

/**
 * Builds a string to display based on the given input alphabet
 * @param inputs 
 * @returns string containing machine's input alphabet
 */
function showAlphabet(inputs) {
    let string = "";
    inputs.forEach(element => {
        string += element + ", "
    });
    return string.substring(0, string.length - 2); // Remove final comma.
}

/**
 * Function component for running an input on the FSA and displaying its status as determinisitc, nondeteminisitc or invalid
 * @param machine JSON for FSA
 * @returns JSX for section of InteractionWindow
 */
export const InputBar = ({ machine }) => {
    //const [showPlay, setShowPlay] = useState(true); // Tracks if play or stop button is shown
    const [inputWord, setInputWord] = useState(""); // Current input word

    return <div>

        {/* Input Bar and Play Button */}
        <div className={styles.InputDiv} data-testid="InputDiv">
            <input className={styles.WordInput}
                data-testid="WordInput"
                placeholder="Enter an input word..."
                onChange={(e) => setInputWord(e.target.value)}>
            </input>

            {/* Play/Stop Buttons for Running Input */}
            <span className={styles.PlayButton} data-testid="PlayButton"
                onClick={() => {
                    //setShowPlay(false)
                    machine.runInput(inputWord)
                }}>&#9655;</span>

            {/* JSX for Stop Button (For Animations) */}
            {/* : <span className={styles.StopButton} data-testid="StopButton" onClick={() => setShowPlay(true)}>&#9723;</span> */}

            {/* Display for FSA Type */}
            <span className={styles.ValidLight} data-testid="ValidLight"
                style={machine.status() != "Invalid"
                    ? { backgroundColor: "green" }
                    : { backgroundColor: "red" }}
            />
        </div>
        <br></br>
        <b>{"Machine Type: " + machine.status()}</b> <br></br> <br></br>
        <b>Machine's Input Alphabet: {showAlphabet(machine.inputAlphabet())}</b>
        <p>Empty Word Symbol: ε</p>
    </div>
}