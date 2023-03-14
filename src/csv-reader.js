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
    [6,"semaphoreEndColumn",11],
    [7,"mutexBeginColumn",12],
    [8,"mutexEndColumn",12],
    [9,"mutexActionBeginColumn",13],
    [10,"mutexActionEndColumn",14],
    [11,"semaphoreGroupBeginColumn",15],
    [12,"semaphoreGroupEndColumn",15]
];

let fileContent = "";
let arrayFromCSV = [];

let actionArray = [];
let taskArray = [];
let semaphoreArray = [];
let mutexArray = [];
let mutexActionArray = [];
let semaphoreGroupArray = [];

// These are the Arrays which contain the Objects, that are used for the logic
let Actions = [];
let Tasks = [];
let Semaphores =[];
let SemaphoreGroups = [];
let Mutexes = [];


//================================================================================================

// this function provides easy printing of values to the console by pressing a button
function debugPrinter()
{   
    // Reset all
    /*
    actionArray = [];
    taskArray = [];
    semaphoreArray = [];
    mutexArray = [];
    mutexActionArray = [];
    semaphoreGroupArray = [];
    Actions = [];
    Tasks = [];
    Semaphores =[];
    SemaphoreGroups = [];
    Mutexes = [];
    console.log(arrayFromCSV);
    */

    convertToObjectBaseValue(arrayFromCSV);
    createSemaphoreObjects();
    createSemaphoreGroupObjects();
    createMutexObjects();
    createActionObjects();
    createTaskObjects();

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


// remove duplicates from Array
//SRC: https://www.naukri.com/learning/articles/remove-duplicates-javascript-array/
function removeDuplicates(arr) 
{
    return arr.filter((item, index) => arr.indexOf(item) === index)
}


//================================================================================================

const readFile = () => {
const reader = new FileReader()
reader.onload = () => {
    fileContent = fileContent + reader.result;
    document.getElementById('out').innerHTML = reader.result
    console.log(fileContent);
    // Write File Content to 2D Array
    arrayFromCSV = csvToArray(fileContent);
}

// start reading the file. When it is done, calls the onload event defined above.
reader.readAsBinaryString(fileInput.files[0])
}






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
    
        //=================== creating the Semaphore Group Array =========================
        // clearing the temp Array
        tempArray = [];
        for(let j = tableValueLocation[10][2] - 1; j <= tableValueLocation[10][2] - 1; j++)
        {
            tempArray.push(convertedCSVArray[i][j]);
        }
        semaphoreGroupArray.push(tempArray)
        

    }
    // log the Arrays to the Console
    console.log("Action Array: ", actionArray);
    console.log("Task Array: ", taskArray);
    console.log("Semaphore Array: ", semaphoreArray );
    console.log("Mutex Array: ", mutexArray);
    console.log("Mutex-Action Array: ", mutexActionArray);
    console.log("Semaphore-Group-Array: ", semaphoreGroupArray);
}

//================================================================================================


/**
* Function Name.        createSemaphoreObjects() 
* Summary.              
* This Function creates all the Semaphores according to the List that is defined by the CSV
* therefore it uses the converted CSV Data in the Array "semaphoreArray[]" to get all the necessary data
*
* The new objects are then saved inside the Semaphores[] Array
* 
* @author.     MH
*
*/
function createSemaphoreObjects()
{
    for(let i = 0; i < semaphoreArray.length; i++)
    {
        if(!(semaphoreArray[i][0]===""))
        {
        // get the semaphore ID and initial Value from the Semaphore Array
        Semaphores.push(new Semaphore(parseInt(semaphoreArray[i][0]),
                                      parseInt(semaphoreArray[i][4]),
                                      parseInt(semaphoreArray[i][3]),
                                      parseInt(semaphoreArray[i][1]),
                                      parseInt(semaphoreArray[i][2])))
        // Debug
        /*console.log("Semaphore Werte:", 
                    "ID:",parseInt(semaphoreArray[i][0]),
                    "Value:", parseInt(semaphoreArray[i][4]),
                    "Gruppe: ",parseInt(semaphoreArray[i][3]),
                    "startwert: ",parseInt(semaphoreArray[i][1]),
                    "endwert: ", parseInt(semaphoreArray[i][2]))*/
        }
    }
    // Debug
    console.log("Semaphores", Semaphores)
}

/**
* Function Name.        createSemaphoreGroupObjects() 
* Summary.              
* This Function creates all the Semaphores according to the List that is defined by the CSV
* therefore it uses the converted CSV Data in the Array "semaphoreArray[]" to get all the necessary data
*
* The new objects are then saved inside the Semaphores[] Array
* 
* @author.     MH
*
*/
function createSemaphoreGroupObjects()
{
    for(let i = 0; i < semaphoreGroupArray.length; i++)
    {
        if(!(semaphoreGroupArray[i][0]==="" || semaphoreGroupArray[i][0]==="\r"))
        {
            if (semaphoreGroupArray[i][0].search("\r") != -1)
            {
                semaphoreGroupArray[i][0] = semaphoreGroupArray[i][0].match(/\d+/)[0];
            }
            let tempArray = [];
            for(let j = 0; j < Semaphores.length; j++)
            {
                // console.log(Semaphores[j].semaphoreGroup,parseInt(semaphoreGroupArray[i][0]))
                if(Semaphores[j].group == parseInt(semaphoreGroupArray[i][0]))
                {
                    tempArray.push(Semaphores[j]);
                }
            }

            // DEBUG
            //console.log("temp array: ", tempArray)
            SemaphoreGroups.push(new SemaphoreGroup(parseInt(semaphoreGroupArray[i][0]),tempArray))
        }
    }

    // DEBUG
    console.log("SemaphoreGroups: ", SemaphoreGroups)
}


/**
* Function Name.        createMutexObjects() 
* Summary.
* This Function creates all the Semaphores according to the List that is defined by the CSV
* therefore it uses the converted CSV Data in the Array "mutexArray[]" to get all the necessary data
* 
* The new objects are then saved inside the Mutexes[] Array
*
* @author.     MH
*
*/
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
    // DEBUG
    console.log("Mutexes", Mutexes)
}



/**
* Function Name.        createActionObjects() 
* Summary.              
* This Function wil create all Action Objects with their in and outgoing Connections
*
* @author.     MH
*
*/
function createActionObjects()
{
    for (let i = 0; i < actionArray.length; i++)
    {
        // check if empty
        if(!(actionArray[i][0]===""))
        {
            // find all SemaphoreGroups that come INTO an Action
            //
            // and add them to the semaphoreGroupIn Array which will be used
            // to create the "Action" Objects
            let semaphoreGroupIn = [];
            for(let j = 0; j < SemaphoreGroups.length; j++)
            {
                for(let l = 0; l < SemaphoreGroups[j].semaphores.length; l++)
                {
                    if(SemaphoreGroups[j].semaphores[l].endpoint == actionArray[i][0])
                    {
                        semaphoreGroupIn.push(SemaphoreGroups[j]);
                    }
                }
            }
            semaphoreGroupIn = removeDuplicates(semaphoreGroupIn)
            console.log(semaphoreGroupIn)

            // find all Semaphores that come OUT of an Action
            //
            // and add them to the semaphoreOut Array which will be used
            // to create the "Action" Objects
            let semaphoreOut = [];
            for(let j = 0; j < Semaphores.length; j++)
            {
                // semaphoreArray[j][2] => Endpoint of semaphore
                if(Semaphores[j].startingpoint == actionArray[i][0])
                {
                    semaphoreOut.push(Semaphores[j]);
                }
            }

            // find all Semaphores that come OUT of an Action
            //
            // and add them to the mutexList Array which will be used
            // to create the "Action" Objects
            let mutexList = [];

            // loop over the fifth table from the CSV -> mutexActionArray
            //
            // in there find all Mutexes that have 
            // a Connection to the Action that is currently created
            for(let j = 0; j < mutexActionArray.length; j++)
            {
                // ignore empty rows
                if(!(mutexActionArray[j][0]===""))
                {
                    // semaphoreArray[j][2] => Endpoint of semaphore
                    if(mutexActionArray[j][0] == actionArray[i][0])
                    {
                        // loop through the already created Mutexes to find the one
                        // that belongs to the Action according to the mutexActionArray
                        for(let l = 0; l < Mutexes.length; l++)
                        {
                            // if Mutex belongs to Action append it to its Mutex List
                            if(Mutexes[l].id == mutexActionArray[j][1])
                            {
                                mutexList.push(Mutexes[l])
                            }
                        }
                    }
                }
            }


            // get the semaphore ID and initial Value from the Semaphore Array
            // Helper: 
            // Action(
            //    int: id, 
            //    string: action_name, 
            //    int: action_steps, 
            //    Semaphore Array: semaphores_in, 
            //    Semaphore Array:semaphores_out, 
            //    Mutex Array:mutex_list
            //    )
            Actions.push(new Action(parseInt(actionArray[i][0]),
                                                actionArray[i][1], 
                                                parseInt(actionArray[i][3]), 
                                                semaphoreGroupIn, 
                                                semaphoreOut, 
                                                mutexList,
                                                parseInt(actionArray[i][2])))
        }
    }
    // DEBUG
    console.log("Actions", Actions)
}


/**
* Function Name.        createTaskObjects() 
* Summary.              
* This Function wil create all Tasks with their according sub-actions
* 
* The "Action"- Objects have to be created first
* 
* @author.     MH
*
*/
function createTaskObjects()
{
    for (let i = 0; i < taskArray.length; i++)
    {
        if(!(taskArray[i][0]===""))
        {
            let tempActionArray = [];
            for(let j = 0; j < Actions.length; j++)
            {
                if(Actions[j].taskAssignment == parseInt(taskArray[i][0]))
                {
                    tempActionArray.push(Actions[j]);
                }
            }
            Tasks.push(new Task(parseInt(taskArray[i][0]),taskArray[i][1],tempActionArray))
        }
    }
    console.log("Tasks: ", Tasks);
}


convertButton.addEventListener('click',readFile);
debugButton.addEventListener('click', debugPrinter);