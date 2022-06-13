export default function handler(req, res) {

  let result = ""
  let expression = req.query.expression
  let error = false
  try {
    
    if(!isCorrectExpression(expression)) {
      throw Error("Error: invalid expression")
    }
    let { operand1,operand2,operation } = splitByOperation(expression)
    result = executeOperation(operand1, operand2, operation)

  } catch(err) {
    
    res.status(400).send(err)
    error = true
  
  }

  if(!error) {
    res.status(200).send(result)
  }
  
}

/*
* Check if the expression is valid
*/
function isCorrectExpression(expression) {
  const re = new RegExp('^\-?([0-9]+|[0-9]+\.[0-9]+)\%?([\-\+*\/])\-?([0-9]+|[0-9]+\.[0-9]+)\%?$')
  return re.test(expression)
}

/*
* Execute the operation given the operands
*/
function executeOperation(operand1, operand2, operation) {
  switch (operation) {
    case "+": {
      return convertOperand(operand1)+convertOperand(operand2)
    }
    case "-": {
      return convertOperand(operand1)-convertOperand(operand2)
    }
    case "/": {
      return convertOperand(operand1)/convertOperand(operand2)
    }
    case "*": {
      return convertOperand(operand1)*convertOperand(operand2)
    }
      
  }
}

/*
* Convert string operand to float
*/
function convertOperand(operand) {
  if(operand.charAt(operand.length-1)=="%") {
    return parseFloat(operand.substring(0, operand.length-1)/100)
  } else {
    return parseFloat(operand)
  }
}

/*
* Splits an expression into two operands and and operation 
*/
function splitByOperation(expression) {
  let operand1, operand2, operation
    
  for(let i=1; i<expression.length; i++) {
    if (["/","*","+","-"].includes(expression.charAt(i))) {
      operation = expression.charAt(i)
      operand1 = expression.substring(0,i)
      operand2 = expression.substring(i+1,expression.length)
      break
    }
  }

  return { operand1, operand2, operation }
}
