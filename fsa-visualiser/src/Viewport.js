import styles from "./styles/Viewport.module.css"
import useMouse from "@react-hook/mouse-position" // https://www.npmjs.com/package/@react-hook/mouse-position
import { useEffect, useRef, useState } from "react"
import { addState, updateStateName } from "./FSA"
import Draggable from 'react-draggable'; // https://www.npmjs.com/package/react-draggable

const circleRadius = 50;

/**
 * Maintains the viewport containing the FSA diagram.
 */
export const Viewport = ({ machine, setMachine }) => {
  const [clickLock, setClickLock] = useState(true);
  const [circleArray, setCircleArray] = useState([]);
  const [coordArray, setCoordArray] = useState([]);

  // Mouse tracking copied from: https://www.npmjs.com/package/@react-hook/mouse-position
  const ref = useRef(null)
  const mouse = useMouse(ref, {})
  // End of copied code.

  // User Click on Viewport
  if (mouse.isDown && clickLock) {
    setClickLock(false);
    // Make a check that if the mouse coordinates are on a circle already in array, do not proceed

    // Change so array is of CURRENT CORRDINATES
    let flag = false;
    coordArray.forEach(element => {
      if ((mouse.x > element[0] - 50) && (mouse.x < element[0] + 50)
        && (mouse.y > element[1] - 50) && (mouse.y < element[1] + 50)) {
        flag = true;
      }
    });

    if (!flag) {

      setMachine(addState("Unnamed"));

      setCircleArray(
        [...circleArray,
        <Draggable key={machine.total} defaultPosition={{ x: mouse.x - circleRadius, y: mouse.y - circleRadius }}>
          <div>
            <input className={styles.stateInput} type="text" defaultValue={"Unnamed"} onChange={(e) => setMachine(updateStateName(machine.total, e.target.value))}
              style={{ height: circleRadius * 1.5, width: circleRadius * 1.5, textAlign: "center" }} />
          </div>
        </Draggable>
        ])

        //console.log(machine);
        

      setCoordArray(
        [...coordArray,
        [mouse.x, mouse.y]
        ]
      )
    }

    setClickLock(!clickLock);
  }

  // Locks clicking so one click = one state made
  useEffect(() => {
    setClickLock(!mouse.isDown)
  }, [clickLock, setClickLock, mouse.isDown]);

  return <div className={styles.Viewport} ref={ref}>
    {circleArray}
  </div>
}
