import styles from '../styles/Display.module.css'

export default function Display(props) {
    
    /*
    * Rendering of the display.
    */
    return (
        
        <div className={`${styles.display} ${props.error && styles.error}`}>
        
            <div className={styles.displayText}>{props.text}</div>

            <div className={props.error?styles.displayError:styles.displaySubText}>{props.error?props.error:props.subText}</div>
        
        </div>

    )
    
}