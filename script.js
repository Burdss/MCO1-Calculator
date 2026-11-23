
// ==========================================
// GET THE DISPLAY ELEMENTS
// ==========================================

const resultDisplay = document.getElementById("result"); // Gets the element that displays the answer.
const expressionDisplay = document.getElementById("expression"); // Gets the element that displays the calculation.
const buttons = document.querySelector(".buttons"); // Gets the container holding all calculator buttons.


// ==========================================
// CALCULATOR VALUES
// ==========================================

let currentInput = "0"; // Stores the current number displayed on the screen.
let firstNumber = null; // Stores the first number in a calculation.
let operator = null; // Stores the selected arithmetic operator.
let waitingForNumber = false; // Checks if the calculator is waiting for another number.
let finished = false; // Checks if the current calculation has finished.
let requestNumber = 0; // Counts calculation requests to help ignore outdated responses.

let pendingTrig = null; // Stores the selected scientific function, such as sin, cos, or tan.
let trigMultiplier = 1; // Stores the number multiplied by the scientific result.


// ==========================================
// UPDATE THE DISPLAY
// ==========================================

function updateDisplay() { // Defines the function that updates the calculator screen.
    resultDisplay.textContent = currentInput; // Displays the current input or answer.
}


// ==========================================
// RESERVED BACKUP: SIN, COS, TAN
// Keep this commented copy for future reference.
// ==========================================

/*
function calculateTrigBackup(action) { // Defines a backup function for scientific calculations.
    const angle = Number(currentInput); // Converts the displayed input into a number.
    const radians = angle * Math.PI / 180; // Converts the angle from degrees to radians.

    if (action === "sin") return Math.sin(radians); // Returns the sine of the angle.
    if (action === "cos") return Math.cos(radians); // Returns the cosine of the angle.
    if (action === "tan") return Math.tan(radians); // Returns the tangent of the angle.
}
*/


// ==========================================
// ACTIVE SCIENTIFIC FUNCTION
// Example: 6 -> cos -> 6 -> =
// Calculates 6 * cos(6 degrees).
// ==========================================

function calculateTrig(action) { // Starts a scientific calculation when a trig button is clicked.
    if (currentInput === "Error") return; // Stops if the display currently shows an error.

    trigMultiplier = Number(currentInput); // Saves the current number as the multiplier.
    pendingTrig = action; // Saves the selected function: sin, cos, or tan.
    expressionDisplay.textContent = `${trigMultiplier}${action}(`; // Shows the beginning of the expression.

    currentInput = "0"; // Resets the display so the user can enter an angle.
    waitingForNumber = true; // Makes the next digit start a new number.
    finished = false; // Marks the calculation as unfinished.

    firstNumber = null; // Clears any unfinished basic calculation's first number.
    operator = null; // Clears any unfinished basic arithmetic operator.

    updateDisplay(); // Refreshes the calculator screen.
}


// ==========================================
// FINISH A SCIENTIFIC CALCULATION
// ==========================================

function finishTrig() { // Calculates the result of the selected scientific function.
    if (pendingTrig === null) return false; // Stops if no scientific function is selected.

    const angle = Number(currentInput); // Gets the angle entered by the user.
    const radians = angle * Math.PI / 180; // Converts the angle from degrees to radians.
    let trigResult; // Creates a variable to store the scientific result.

    if (pendingTrig === "sin") { // Checks whether sine was selected.
        trigResult = Math.sin(radians); // Calculates the sine.
    } else if (pendingTrig === "cos") { // Checks whether cosine was selected.
        trigResult = Math.cos(radians); // Calculates the cosine.
    } else if (pendingTrig === "tan") { // Checks whether tangent was selected.
        if (Math.abs(Math.cos(radians)) < 1e-10) { // Checks if tangent is undefined at this angle.
            currentInput = "Error"; // Sets the display to an error.
            expressionDisplay.textContent = "Undefined"; // Explains why the result is unavailable.
            pendingTrig = null; // Clears the selected scientific function.
            updateDisplay(); // Displays the error.
            finished = true; // Marks the calculation as finished.
            waitingForNumber = false; // Stops waiting for another number.
            return true; // Ends the function because the angle is invalid for tangent.
        }

        trigResult = Math.tan(radians); // Calculates the tangent for a valid angle.
    }

    const answer = trigMultiplier * trigResult; // Multiplies the scientific result by the saved number.

    if (!Number.isFinite(answer)) { // Checks whether the answer is a valid finite number.
        currentInput = "Error"; // Displays an error for an invalid answer.
        expressionDisplay.textContent = "Invalid calculation"; // Shows the error message.
    } else {
        expressionDisplay.textContent = // Starts updating the expression shown above the answer.
            `${trigMultiplier}${pendingTrig}(${angle}°) =`; // Shows the complete scientific calculation.

        currentInput = String(Number(answer.toFixed(8))); // Rounds the answer to eight decimal places.
    }

    pendingTrig = null; // Clears the selected scientific function.
    trigMultiplier = 1; // Resets the scientific multiplier.
    firstNumber = null; // Clears the first arithmetic number.
    operator = null; // Clears the arithmetic operator.
    waitingForNumber = false; // Stops waiting for another number.
    finished = true; // Marks the calculation as complete.

    updateDisplay(); // Displays the final answer.
    return true; // Indicates that the scientific calculation was handled.
}


// ==========================================
// ADD A NUMBER
// ==========================================

function addNumber(number) { // Handles clicks on number buttons.
    if (currentInput === "Error" || finished || waitingForNumber) { // Checks whether a fresh number should start.
        currentInput = number === "00" ? "0" : number; // Starts the input with the selected number.
        waitingForNumber = false; // Allows additional digits to be entered.
        finished = false; // Marks the new input as unfinished.
    } else if (currentInput === "0") { // Checks if the display only contains zero.
        currentInput = number === "00" ? "0" : number; // Replaces the initial zero.
    } else if (currentInput.length < 15) { // Limits the input to 15 characters.
        currentInput += number; // Adds the selected digit to the current input.
    }

    if (pendingTrig !== null) { // Checks if a scientific calculation is in progress.
        expressionDisplay.textContent = // Updates the expression shown above the display.
            `${trigMultiplier}${pendingTrig}(${currentInput}`; // Shows the entered angle inside the expression.
    }

    updateDisplay(); // Refreshes the displayed number.
}


// ==========================================
// ADD A DECIMAL POINT
// ==========================================

function addDecimal() { // Handles clicks on the decimal-point button.
    if (currentInput === "Error" || finished || waitingForNumber) { // Checks if a new decimal number should start.
        currentInput = "0."; // Starts a new decimal number with zero.
        waitingForNumber = false; // Allows the user to continue entering digits.
        finished = false; // Marks the new number as unfinished.
    } else if (!currentInput.includes(".")) { // Checks that the number has no decimal point yet.
        currentInput += "."; // Adds the decimal point to the input.
    }

    if (pendingTrig !== null) { // Checks if a scientific calculation is in progress.
        expressionDisplay.textContent = // Updates the scientific expression.
            `${trigMultiplier}${pendingTrig}(${currentInput}`; // Shows the current angle being entered.
    }

    updateDisplay(); // Refreshes the calculator screen.
}


// ==========================================
// SELECT AN ARITHMETIC OPERATOR
// ==========================================

function chooseOperator(symbol) { // Handles the selected arithmetic operator.
    if (currentInput === "Error" || pendingTrig !== null) return; // Stops if an error or scientific calculation is active.

    if (waitingForNumber && firstNumber !== null) { // Checks if the calculator is already waiting for the second number.
        operator = symbol; // Replaces the previously selected operator.
    } else {
        firstNumber = Number(currentInput); // Saves the current input as the first number.
        operator = symbol; // Saves the selected operator.
    }

    const shownOperator = // Creates the operator symbol displayed to the user.
        symbol === "*" ? "×" : // Displays multiplication as ×.
        symbol === "/" ? "÷" : symbol; // Displays division as ÷ and keeps other symbols unchanged.

    expressionDisplay.textContent = `${firstNumber} ${shownOperator}`; // Shows the first number and operator.
    waitingForNumber = true; // Makes the next number become the second number.
    finished = false; // Marks the calculation as unfinished.
}


// ==========================================
// CALCULATE USING JAVASCRIPT OR PHP
// ==========================================

async function calculate() { // Defines the function that calculates the answer.
    if (pendingTrig !== null) { // Checks if a scientific calculation is active.
        finishTrig(); // Calculates sin, cos, or tan in JavaScript.
        return; // Stops here because the scientific calculation is complete.
    }

    if (operator === null || firstNumber === null || waitingForNumber) { // Checks if the arithmetic calculation is incomplete.
        return; // Stops if a number or operator is missing.
    }

    const secondNumber = Number(currentInput); // Converts the current input into the second number.
    const first = firstNumber; // Saves the first number for this calculation.
    const symbol = operator; // Saves the selected operator for this calculation.
    const thisRequest = ++requestNumber; // Creates a unique request number.

    const shownOperator = // Creates the operator symbol shown in the expression.
        symbol === "*" ? "×" : // Displays multiplication as ×.
        symbol === "/" ? "÷" : symbol; // Displays division as ÷.

    expressionDisplay.textContent = // Starts updating the expression display.
        `${first} ${shownOperator} ${secondNumber} =`; // Shows the complete calculation.

    buttons.style.pointerEvents = "none"; // Temporarily prevents button clicks during the request.

    try { // Starts a block for handling the PHP request.
        const response = await fetch("./calculate.php", { // Sends the calculation to calculate.php.
            method: "POST", // Sends data to the PHP file.
            headers: { // Defines information about the request.
                "Content-Type": "application/json" // Tells PHP the request body uses JSON.
            },
            body: JSON.stringify({ // Converts the calculation details into JSON text.
                first: first, // Sends the first number to PHP.
                second: secondNumber, // Sends the second number to PHP.
                operator: symbol // Sends the selected operator to PHP.
            })
        });

        const contentType = response.headers.get("content-type") || ""; // Reads the response content type.

        if (!contentType.includes("application/json")) { // Checks if PHP returned JSON.
            throw new Error("PHP did not return JSON. Check calculate.php."); // Reports an unexpected response.
        }

        const data = await response.json(); // Converts the JSON response into a JavaScript object.

        if (!response.ok || !data.success) { // Checks if the request or calculation failed.
            throw new Error(data.error || "Calculation failed"); // Creates an error using PHP's message when available.
        }

        if (thisRequest !== requestNumber) return; // Ignores this result if a newer request has replaced it.

        currentInput = String(data.result); // Saves the answer returned by PHP as text.
        updateDisplay(); // Shows the answer on the calculator screen.

        firstNumber = null; // Clears the first number after the calculation.
        operator = null; // Clears the selected operator.
        waitingForNumber = false; // Stops waiting for another number.
        finished = true; // Marks the calculation as complete.

    } catch (error) { // Handles errors from the request or calculation.
        console.error(error); // Prints the error details in the developer console.
        currentInput = "Error"; // Sets the calculator display to Error.
        updateDisplay(); // Displays the error state.
        expressionDisplay.textContent = error.message; // Shows the error message above the display.

        firstNumber = null; // Clears the first number after an error.
        operator = null; // Clears the operator after an error.
        waitingForNumber = false; // Stops waiting for another number.
        finished = true; // Marks the failed calculation as finished.

    } finally { // Runs whether the request succeeds or fails.
        buttons.style.pointerEvents = "auto"; // Enables calculator button clicks again.
    }
}


// ==========================================
// PERCENTAGE
// ==========================================

function percentage() { // Defines the percentage button's behavior.
    if (currentInput === "Error" || pendingTrig !== null) return; // Stops if an error or scientific calculation is active.

    currentInput = String(Number(currentInput) / 100); // Divides the current number by 100.
    updateDisplay(); // Displays the percentage value.
}


// ==========================================
// CLEAR THE CALCULATOR
// ==========================================

function clearCalculator() { // Resets the calculator to its starting state.
    requestNumber++; // Invalidates any older calculation request.

    currentInput = "0"; // Resets the displayed number to zero.
    firstNumber = null; // Clears the first number.
    operator = null; // Clears the selected operator.
    waitingForNumber = false; // Resets the input-waiting status.
    finished = false; // Marks the calculator as ready for a new calculation.
    pendingTrig = null; // Clears any selected scientific function.
    trigMultiplier = 1; // Resets the scientific multiplier.

    expressionDisplay.textContent = ""; // Clears the expression display.
    updateDisplay(); // Shows zero on the calculator screen.
}


// ==========================================
// DELETE THE LAST DIGIT
// ==========================================

function backspace() { // Defines the delete button's behavior.
    if (currentInput === "Error" || finished || waitingForNumber) { // Checks if deleting is currently unavailable.
        return; // Stops the function when deleting is not allowed.
    }

    currentInput = currentInput.slice(0, -1); // Removes the last character from the input.

    if (currentInput === "" || currentInput === "-") { // Checks if the input has become empty.
        currentInput = "0"; // Restores zero when no digits remain.
    }

    if (pendingTrig !== null) { // Checks if a scientific calculation is in progress.
        expressionDisplay.textContent = // Updates the expression display.
            `${trigMultiplier}${pendingTrig}(${currentInput}`; // Shows the updated angle.
    }

    updateDisplay(); // Refreshes the displayed number.
}


// ==========================================
// HANDLE ALL BUTTON CLICKS
// ==========================================

buttons.addEventListener("click", function(event) { // Listens for clicks inside the calculator button container.
    const button = event.target.closest("button"); // Finds the button that was clicked.
    if (!button) return; // Stops if the click did not come from a button.

    if (button.dataset.number !== undefined) { // Checks if the clicked button contains a number.
        addNumber(button.dataset.number); // Sends the button's number to the number function.

    } else if (button.dataset.operator) { // Checks if the clicked button is an arithmetic operator.
        chooseOperator(button.dataset.operator); // Sends the selected operator to its function.

    } else { // Handles buttons that perform other actions.
        switch (button.dataset.action) { // Checks the action assigned to the clicked button.
            case "clear": // Handles the AC button.
                clearCalculator(); // Resets the calculator.
                break; // Stops this switch case.

            case "percent": // Handles the percentage button.
                percentage(); // Converts the current number into a percentage.
                break; // Stops this switch case.

            case "backspace": // Handles the delete button.
                backspace(); // Removes the last digit.
                break; // Stops this switch case.

            case "decimal": // Handles the decimal-point button.
                addDecimal(); // Adds a decimal point.
                break; // Stops this switch case.

            case "equals": // Handles the equals button.
                calculate(); // Calculates the answer using JavaScript or PHP.
                break; // Stops this switch case.

            case "sin": // Handles the sine button.
            case "cos": // Handles the cosine button.
            case "tan": // Handles the tangent button.
                calculateTrig(button.dataset.action); // Starts the selected scientific calculation.
                break; // Stops this switch case.

            /*
            case "sqrt": // Reserved for a future square-root button.
                calculateSqrt(); // Calls the square-root function when it is implemented.
                break; // Stops this switch case.
            */
        }
    }
});


// ==========================================
// START THE CALCULATOR
// ==========================================

updateDisplay(); // Displays the initial value when the calculator loads.
