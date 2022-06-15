import styles from '../styles/Button.module.css'

export default function Button(props) {
    
    /*
    * Rendering of the button.
    */
    return (
        
        <button className={`${styles.button} ${styles[props.type]}`} onClick={() => props.onClick(props.text)}>    
            {props.text}
        </button>

    )
    
}