
// import the Jquery CSV Module
//var csv = require('jquery-csv');

// https://github.com/evanplaice/jquery-csv/blob/main/src/jquery.csv.js
//=============================================================================

// Quelle
// https://stackoverflow.com/questions/29393064/reading-in-a-local-csv-file-in-javascript/29395276#29395276

//=============================================================================

// print the CSV Data to the Document for Debugging

const fileInput = document.getElementById('csv-file-input')
const readFile = () => {
const reader = new FileReader()
reader.onload = () => {
    document.getElementById('out').innerHTML = reader.result
}


// start reading the file. When it is done, calls the onload event defined above.
reader.readAsBinaryString(fileInput.files[0])
}

fileInput.addEventListener('change', readFile)


//=============================================================================

// convert the Input CSV to an Array
// Code was partially provided by ChatGPT

let arrayFromCSV;

$(document).ready(function() 
{
    $('#convert-csv').click(function() 
    {
        // Get the file input element
        var input = $('#csv-file-input')[0];

        // Check if a file has been selected
        if (input.files && input.files[0]) 
        {
            // Create a FileReader object
            var reader = new FileReader();

            // Set the callback function for when the file has been read
            reader.onload = function(e) 
            {
                // Get the CSV data from the file
                var csvData = e.target.result;

                // Use the jquery-csv library to parse the CSV data
                var parsedData = $.csv.toArrays(csvData);
                arrayFromCSV = parsedData;
                console.log("Array has been updated from CSV");
                console.log(arrayFromCSV);
            };

            // Read the selected file as text
            reader.readAsText(input.files[0]);
        }
    });
});

//=============================================================================