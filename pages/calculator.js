import Button from './button'
import Display from './display'
import History from './history'
import styles from '../styles/Calculator.module.css'
import React, { useState } from 'react';

export default function Calculator() {

    const [expression, setExpression] = useState("");
    const [subExpression, setSubExpression] = useState("0");
    const [error, setError] = useState(false);

    const [operationHistory, setOperationHistory] = useState([]);

    let carriedOperation = false;

    /*
    * Gets the initial history
    */
    React.useEffect(() => {
        
        fetch(`api/history`, { method: "GET"})
        .then(
    
            response => response.json()
        
        )
        .then(

            history => setOperationHistory(history)

        )
      
    }, operationHistory);

    /*
    * Return if an operand's syntax is correct
    */
   function isCorrectOperand(operand) {

        const re = new RegExp('^\-?([0-9]+|[0-9]+\.[0-9]+)\%?$')
        return re.test(operand)

   }

    /*
    * Updating subExpression with the new non operator char (% is always kept at the end of the expression, - is always kept at the start).
    */
    function updateSubExpression(newChar) {

        // Resets the error
        setError(false)
                
        // If first character is a 0 and we do not have a . in the expression, substitute it with the new char (if the new char is not a .) 
        if (subExpression.indexOf(".")==-1 && newChar!=".") {

            // If the first character is a - keeps it
            if(subExpression.charAt(0)=="-" && subExpression.charAt(1)=="0") {

                setSubExpression("-"+newChar+subExpression.substring(2))
                return

            } else if (subExpression.charAt(0)=="0") {

                setSubExpression(newChar+subExpression.substring(1))
                return

            }
        }

        // If an expression ends with a %, keeps it
        if(subExpression.charAt(subExpression.length-1)=="%") {

            setSubExpression(subExpression.substring(0,subExpression.length-1)+newChar+"%")

        } 
        // Else, just append the new character
        else {

            setSubExpression(subExpression+newChar)

        }

    }

    /*
    * Updating expression with the a new operation.
    */
    function updateExpressionWithOperation(operator) {

        // Resets the error
        setError(false)

        // If the expression is empty and the subExpression is a correct operand, then the expression becomes the subExpression with the operand.
        if(expression.length==0 && isCorrectOperand(subExpression)) {

            setExpression(subExpression+operator)
            setSubExpression("0")

        }
        // Else we have pressed an operand when we already have a valid expression, so we carry over the new operand and calculate the result.     
        else {

            carriedOperation = operator
            calculateResult()

        }

    }

    /*
    * Clearing both expression and subExpression.
    */
    function clearExpression() {

        // Resets the error
        setError(false)

        setExpression("")
        setSubExpression("0")

    }

    /*
    * Removing last char from subExpression.
    */
    function removeLastChar() {
        
        // Resets the error
        setError(false)

        let percentage = false
        let newSubExpression = ""

        if (subExpression.charAt(subExpression.length-1)=="%") {

            newSubExpression = subExpression.substring(0, subExpression.length-1)
            percentage = true

        } else {

            newSubExpression = subExpression

        }
        
        if(newSubExpression.length==2 && newSubExpression.charAt(0)=="-") {

            newSubExpression="-0"

        } else if(newSubExpression.length==1) {

            newSubExpression="0"

        } else {

            newSubExpression=newSubExpression.substring(0, newSubExpression.length-1)

        }

        setSubExpression(newSubExpression+(percentage?"%":""))
        
    }

    /*
    * If not already added to subExpression, add a point.
    */
    function addPoint() {
        
        // Resets the error
        setError(false)

        if(subExpression.length > 0 && subExpression.lastIndexOf(".")==-1) {

            updateSubExpression(".")

        } 

    }

    /*
    * If not already added to subExpression, add a percentage. Else remove it.
    */
    function addPercentage() {
        
        // Resets the error
        setError(false)

        if(subExpression.lastIndexOf("%")==-1) {

            setSubExpression(subExpression+"%")

        } else {

            setSubExpression(subExpression.substring(0, subExpression.length-1))

        }

    }

    /*
    * GET call to api/result to get the result of the operation.
    */
    function calculateResult() {
        
        // Resets the error
        setError(false)
        
        //If both expression and subExpression are correct operands, calculate the result
        if(isCorrectOperand(expression.substring(0, expression.length-1)) && isCorrectOperand(subExpression)) {

            let error

            fetch(`api/result?expression=${(expression+subExpression).replace("+","%2b")}`)
            .then(response => {

                error = !response.ok
                return response.text()

            })
            .then(result => {

                if (error) {

                    throw new Error(result)

                } else {

                    // Update the operation history, then if we have a carried operation we add it to the expression, otherwise we set the result to the subExpression.

                    setOperationHistory(operationHistory.concat(expression+subExpression+"="+result))

                    if(carriedOperation) {

                        setExpression(result+carriedOperation)
                        setSubExpression("0")
                        carriedOperation = false

                    } else {

                        setExpression("")
                        setSubExpression(result)

                    }

                }

                

            })
            .catch(error => {

                // Sets the error, then clears the expression/subExpression.
                setError(error.message)
                setSubExpression("0")
                setExpression("")

            })

        }

    }

    /*
    * Toggles the negative sign for the current SubExpression.
    */
    function changeSign() {
        
        // Resets the error
        setError(false)

        if(subExpression.charAt(0)=="-") {

            setSubExpression(subExpression.substring(1))

        } else {

            setSubExpression("-"+subExpression)

        }
    }

    /*
    * Cleans the operation history
    */
    function clearOperationHistory() {

        fetch(`api/history`, { method: "DELETE" })
        .then(
        
            response => response.json()
        
        )
        .then(

            history => setOperationHistory(history)

        )

    }

    /*
    * Rendering of the calculator.
    */
    return (
        
        <div className={styles.container}>

            <div className={styles.buttonsContainer}>

                <div className={styles.displayContainer}>
                    <Display error={error} text={expression} subText={subExpression}/>
                </div>
                
                <div className={styles.buttonsRowContainer}>
                    <Button text="%" type="operation" onClick={addPercentage}/>
                    <Button text="C" type="operation" onClick={clearExpression}/>
                    <Button text="←" type="operation" onClick={removeLastChar}/>
                    <Button text="/" type="operation" onClick={updateExpressionWithOperation}/>
                </div>
                
                <div className={styles.buttonsRowContainer}>
                    <Button text="7" type="number" onClick={updateSubExpression}/>
                    <Button text="8" type="number" onClick={updateSubExpression}/>
                    <Button text="9" type="number" onClick={updateSubExpression}/>
                    <Button text="*" type="operation" onClick={updateExpressionWithOperation}/>
                </div>

                <div className={styles.buttonsRowContainer}>
                    <Button text="4" type="number" onClick={updateSubExpression}/>
                    <Button text="5" type="number" onClick={updateSubExpression}/>
                    <Button text="6" type="number" onClick={updateSubExpression}/>
                    <Button text="+" type="operation" onClick={updateExpressionWithOperation}/>
                </div>
                
                <div className={styles.buttonsRowContainer}>
                    <Button text="1" type="number" onClick={updateSubExpression}/>
                    <Button text="2" type="number" onClick={updateSubExpression}/>
                    <Button text="3" type="number" onClick={updateSubExpression}/>
                    <Button text="-" type="operation" onClick={updateExpressionWithOperation}/>
                </div>

                <div className={styles.buttonsRowContainer}>
                    <Button text="+/-" type="operation" onClick={changeSign}/>
                    <Button text="0" type="number" onClick={updateSubExpression}/>
                    <Button text="." type="operation" onClick={addPoint}/>
                    <Button text="=" type="result" onClick={calculateResult}/>
                </div>
            </div>

            <History operationHistory={operationHistory} clearOperationHistory={clearOperationHistory}/>

        </div>
    )

}