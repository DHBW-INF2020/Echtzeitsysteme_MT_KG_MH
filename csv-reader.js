// import the Jquery CSV Module
var csv = require('jquery-csv');

//=============================================================================

// Quelle
// https://stackoverflow.com/questions/29393064/reading-in-a-local-csv-file-in-javascript/29395276#29395276

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