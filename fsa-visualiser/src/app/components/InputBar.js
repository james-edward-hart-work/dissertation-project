import { useState } from "react";
import styles from "../../styles/InputBar.module.css"

export const InputBar = ({ machine }) => {
    const [showPlay, setShowPlay] = useState(true); // Tracks if play or stop button is shown
    const [inputWord, setInputWord] = useState("");

    return <div>
    <div className={styles.InputDiv} data-testid="InputDiv">
        <input className={styles.WordInput}
            data-testid="WordInput"
            placeholder="Enter an input word..."
            onChange={(e) => setInputWord(e.target.value)}>
        </input>
        {showPlay
            ? <span className={styles.PlayButton} data-testid="PlayButton"
                onClick={() => {
                    //setShowPlay(false)
                    machine.runInput(inputWord)
                }}>&#9655;</span>
            : <span className={styles.StopButton} data-testid="StopButton" onClick={() => setShowPlay(true)}>&#9723;</span>
        }

        {machine.status() != "Invalid"
            ? <span className={styles.ValidLight} data-testid="ValidLight" style={{ backgroundColor: "green" }}></span>
            : <span className={styles.ValidLight} data-testid="ValidLight" style={{ backgroundColor: "red" }}></span>
        }
    </div>
    <p>{machine.status()}</p>
    </div>
}