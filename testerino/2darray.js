// print the CSV Data to the Document for Debugging


const fileInput = document.getElementById('csv-file-input')
const convertButton = document.getElementById('convert-csv');
const debugButton = document.getElementById('debug-printer');
const changeCSVSettings = document.getElementById('change-csv-settings');

const csvColumnSettings = document.getElementById('csv-column-settings');

let tableRowLength = 0;

let tableValueLocation = [
    [1,"actionBeginColumn",1],
    [2,"actionEndColumn",4],
    [3,"taskBeginColumn",5],
    [4,"taskEndColumn",6],
    [5,"semaphoreBeginColumn",7],
    [6,"semaphoreEndColumn",10],
    [7,"mutexBeginColumn",11],
    [8,"mutexEndColumn",11],
    [9,"mutexActionBeginColumn",12],
    [10,"mutexActionEndColumn",13]
];

let fileContent = "";
let arrayFromCSV = [];

let actionArray = [];
let taskArray = [];
let semaphoreArray = [];
let mutexArray = [];
let mutexActionArray = [];

let Actions = [];
let Tasks = [];
let Semaphores =[];
let Mutexes = [];


//================================================================================================

// this function provides easy printing of values to the console by pressing a button
function debugPrinter()
{
    console.log(arrayFromCSV);
    convertToObjectBaseValue(arrayFromCSV);

    createSemaphoreObjects()
    createMutexObjects()
    createActionObjects()
}

function changeCSVDefaultValues()
{
    tableValueLocation[0][3] = Number(document.getElementById('action-begin').value);
    tableValueLocation[1][3] = Number(document.getElementById('action-end').value);
    tableValueLocation[2][3] = Number(document.getElementById('task-begin').value);
    tableValueLocation[3][3] = Number(document.getElementById('task-end').value);
    tableValueLocation[4][3] = Number(document.getElementById('semaphore-begin').value);
    tableValueLocation[5][3] = Number(document.getElementById('semaphore-end').value);
    tableValueLocation[6][3] = Number(document.getElementById('mutex-begin').value);
    tableValueLocation[7][3] = Number(document.getElementById('mutex-end').value);
    tableValueLocation[8][3] = Number(document.getElementById('mutex-action-begin').value); 
    tableValueLocation[9][3] = Number(document.getElementById('mutex-end-begin').value);

    console.log(tableValueLocation)
}

// converts a csv string into a 2D Array
function csvToArray (csv) {
    rows = csv.split("\n");

    return rows.map(function (row) {
    	return row.split(";");
    });
};

//================================================================================================

const readFile = () => {
const reader = new FileReader()
reader.onload = () => {
    fileContent = fileContent + reader.result;
    document.getElementById('out').innerHTML = reader.result
    console.log(fileContent);
    arrayFromCSV = csvToArray(fileContent);

    // allow user to change the default column settings
    csvColumnSettings.style.display = "initial";
    let csvNumberInputs = document.querySelectorAll('.csv-column-setting-input')
    for (let i = 0; i <csvNumberInputs.length; i++)
    {
        csvNumberInputs[i].setAttribute("max",arrayFromCSV[0].length)
    }

}

// start reading the file. When it is done, calls the onload event defined above.
reader.readAsBinaryString(fileInput.files[0])
}


convertButton.addEventListener('click',readFile)
debugButton.addEventListener('click', debugPrinter)
changeCSVSettings.addEventListener('click', changeCSVDefaultValues)



//================================================================================================

function convertToObjectBaseValue(convertedCSVArray){

    // start with 1 as the first line are the column names
    for (let i = 1; i < convertedCSVArray.length; i++)
    {
        //=================== creating the Action Array =========================
        let tempArray =[];
        // -1 because the column specification is not zero-indexed
        // % or mod because it should always have only the lines of the beginning or end variables
        for(let j = tableValueLocation[0][2] - 1; j <= tableValueLocation[1][2] - 1; j++)
        {
            tempArray.push(convertedCSVArray[i][j]);
        }
        actionArray.push(tempArray);
        
        //=================== creating the Task Array =========================
        // clearing the temp Array
        tempArray = [];
        for(let j = tableValueLocation[2][2] - 1; j <= tableValueLocation[3][2] - 1; j++)
        {
            tempArray.push(convertedCSVArray[i][j]);
        }
        taskArray.push(tempArray)

        //=================== creating the Semaphore Array =========================
        // clearing the temp Array
        tempArray = [];
        for(let j = tableValueLocation[4][2] - 1; j <= tableValueLocation[5][2] - 1; j++)
        {
            tempArray.push(convertedCSVArray[i][j]);
        }
        semaphoreArray.push(tempArray)

        //=================== creating the Mutex Array =========================
        // clearing the temp Array
        tempArray = [];
        for(let j = tableValueLocation[6][2] - 1; j <= tableValueLocation[7][2] - 1; j++)
        {
            tempArray.push(convertedCSVArray[i][j]);
        }
        mutexArray.push(tempArray)

        //=================== creating the Mutex-Action Array =========================
        // clearing the temp Array
        tempArray = [];
        for(let j = tableValueLocation[8][2] - 1; j <= tableValueLocation[9][2] - 1; j++)
        {
            tempArray.push(convertedCSVArray[i][j]);
        }
        mutexActionArray.push(tempArray)
    

        

    }
    // log the Arrays to the Console
    console.log("Action Array: ", actionArray);
    console.log("Task Array: ", taskArray);
    console.log("Semaphore Array: ", semaphoreArray );
    console.log("Mutex Array: ", mutexArray);
    console.log("Mutex-Action Array: ", mutexActionArray);
}

//================================================================================================

function createSemaphoreObjects()
{
    for(let i = 0; i < semaphoreArray.length; i++)
    {
        if(!(semaphoreArray[i][0]===""))
        {
        // get the semaphore ID and initial Value from the Semaphore Array
        Semaphores.push(new Semaphore(parseInt(semaphoreArray[i][0]),semaphoreArray[i][3]))
        }
    }

    console.log("Semaphores", Semaphores)
}

function createMutexObjects()
{
    for (let i = 0; i < mutexArray.length; i++)
    {
        if(!(mutexArray[i][0]===""))
        {
        // get the semaphore ID and initial Value from the Semaphore Array
        Mutexes.push(new Mutex(parseInt(mutexArray[i][0])))
        }
    }
    console.log("Mutexes", Mutexes)
}

function createActionObjects()
{
    for (let i = 0; i < actionArray.length; i++)
    {
        // check if empty
        if(!(actionArray[i][0]===""))
        {
            // find all Semaphores that come into the Action
            let semaphoresIn = [];
            for(let j = 0; j < semaphoreArray.length; j++)
            {
                if(!(semaphoreArray[j][0]===""))
                {
                    // semaphoreArray[j][2] => Endpoint of semaphore
                    if(semaphoreArray[j][2] == actionArray[i][0])
                    {
                        semaphoresIn.push(Semaphores[j])
                    }
                }
            }

            console.log("Semaphores in: ", semaphoresIn)

            let semaphoresOut = [];

            let mutexList = [];

            // get the semaphore ID and initial Value from the Semaphore Array
            Actions.push(new Action(parseInt(actionArray[i][0]),actionArray[i][1], parseInt(actionArray[i][3]),semaphoresIn, semaphoresOut, mutexList))
        }
    }
    console.log("Actions", Actions)
}

function createTaskObjects()
{
    for (let i = 0; i < taskArray.length; i++)
    {

        Tasks.push()
    }
}
