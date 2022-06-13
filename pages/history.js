import styles from '../styles/History.module.css'
import React, {useState} from 'react'

export default function History(props) {

    const [show, setShow] = useState(true);

    /*
    * Toggles the visualization of the history
    */
    function toggleHistory() {
        document.getElementById("operations").style.width = show?"0px":"auto"
        document.getElementById("operations").style.minWidth = show?"0px":"200px"
        document.getElementById("operations").style.paddingRight = show?"0px":"10px"
        setShow(!show)
    }
    
    /*
    * Rendering of the history.
    */
    return <div className={styles.history}>
            <button onClick={ () => toggleHistory()} className={styles.button}>&#9776;</button> 
            { show && <><span className={styles.title}>History</span> {props.operationHistory.length>0 && <button onClick={() => props.clearOperationHistory()} className={styles.deleteButton}>X</button>}</>}
            {<div id="operations" className={styles.operations}>
                {show && 
                    <>
                        {props.operationHistory.map( (operation, index) => <div className={styles.operation} key={index}>{operation}</div> )}
                    </>
                }
            </div>}
        </div>
}