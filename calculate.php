
<?php // Starts the PHP code.

// Tell the browser that the response is JSON.
header("Content-Type: application/json; charset=UTF-8");

// Read the JSON data sent by JavaScript and convert it into a PHP array.
$data = json_decode(file_get_contents("php://input"), true);

// Check whether the input contains valid numbers and an operator.
if (
    !is_array($data) ||
    !isset($data["first"], $data["second"], $data["operator"]) ||
    !is_numeric($data["first"]) ||
    !is_numeric($data["second"]) ||
    !is_string($data["operator"])
) {
    http_response_code(400); // Sends an invalid request status.

    echo json_encode([ // Returns the error as JSON.
        "success" => false, // Indicates that the calculation failed.
        "error" => "Invalid input" // Explains the error.
    ]);
    exit; // Stops the script.
}

// Convert the received values into the correct types.
$first = (float) $data["first"]; // Stores the first number.
$second = (float) $data["second"]; // Stores the second number.
$operator = $data["operator"]; // Stores the selected operator.

// Perform the requested calculation.
switch ($operator) {
    case "+": // Handles addition.
        $result = $first + $second; // Adds the numbers.
        break; // Ends this case.

    case "-": // Handles subtraction.
        $result = $first - $second; // Subtracts the second number from the first.
        break; // Ends this case.

    case "*": // Handles multiplication.
        $result = $first * $second; // Multiplies the numbers.
        break; // Ends this case.

    case "/": // Handles division.
        if ($second == 0) { // Checks whether the second number is zero.
            http_response_code(400); // Sends an invalid request status.

            echo json_encode([ // Returns the error as JSON.
                "success" => false, // Indicates that the calculation failed.
                "error" => "Cannot divide by zero" // Explains the error.
            ]);
            exit; // Stops the script.
        }

        $result = $first / $second; // Divides the first number by the second.
        break; // Ends this case.

    default: // Handles unsupported operators.
        http_response_code(400); // Sends an invalid request status.

        echo json_encode([ // Returns the error as JSON.
            "success" => false, // Indicates that the calculation failed.
            "error" => "Invalid operator" // Explains the error.
        ]);
        exit; // Stops the script.
}

// Return the answer to JavaScript.
echo json_encode([ // Converts the result into JSON.
    "success" => true, // Indicates that the calculation succeeded.
    "result" => $result // Sends the calculated answer.
]); 

?> 
