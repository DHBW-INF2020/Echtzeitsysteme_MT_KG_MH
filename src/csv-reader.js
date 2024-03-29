const fileInput = document.getElementById('csv-file-input')
const convertButton = document.getElementById('convert-csv');
const debugButton = document.getElementById('debug-printer');
const changeCSVSettings = document.getElementById('change-csv-settings');
const csvColumnSettings = document.getElementById('csv-column-settings');
const fileGuard = document.getElementById('csv-file-input').addEventListener('change', validateFileType);


let tableRowLength = 0;
let tableValueLocation = [
    [1,"actionBeginColumn",1],
    [2,"actionEndColumn",4],
    [3,"taskBeginColumn",6],
    [4,"taskEndColumn",7],
    [5,"semaphoreBeginColumn",9],
    [6,"semaphoreEndColumn",13],
    [7,"mutexActionBeginColumn",15],
    [8,"mutexActionEndColumn",16],
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

const readFile = () => {
    const reader = new FileReader()
    reader.onload = () => {
        fileContent = reader.result;

        // Write File Content to 2D Array
        arrayFromCSV = csvToArray(fileContent);
    }
    // start reading the file. When it is done, calls the onload event defined above.
    reader.readAsText(fileInput.files[0]);
    addNewMessage("Notification","file read","g");

    reader.onloadend = () => {
        initFromCSV();
        showDiagram(diagram);
    }
}

convertButton.addEventListener('click',readFile);

function filterBlankLines(textArray){
    filteredArray = [];
    for(let i = 0; i < textArray.length; i++){
        if(textArray[i] != ""){
            filteredArray.push(textArray[i]);
        }
    }
    return filteredArray;
}

// converts a csv string into a 2D Array
function csvToArray (csv) {
    if (navigator.userAgent.indexOf('Win') != -1) {
        console.log('Windows');
        rows = csv.split("\r\n");
    } else if (navigator.userAgent.indexOf('Linux') != -1) {
        console.log('Linux');
        rows = csv.split("\n");
    }else if (navigator.userAgent.indexOf('Mac') != -1) {
        console.log('Mac');
        rows = csv.split("\r\n");
    }
    filteredRows = filterBlankLines(rows);

    return filteredRows.map(function (row) {
    	return row.split(";");
    });
};

/**
* Function Name.        validateFileType() 
* Summary. 
* This function checks whether the uploaded File is a CSV
* Needed because the constraint on the Input field is not foolproof
* -> if not throws an error             
* 
* @author.     MH (help by Chat GPT)
*
*/
function validateFileType() {
    const fileInput = document.getElementById('csv-file-input');
    const file = fileInput.files[0];
    const allowedExtensions = /(\.csv)$/i;

    if (!allowedExtensions.exec(file.name)) {
        alert('Bitte eine CSV Datei hochladen!!!');
        fileInput.value = '';
        return false;
    }
    else
    {
        // enable Simulation-Initilazation
        document.getElementById("convert-csv").disabled = false;
    }
}

//================================================================================================

// this function provides easy printing of values to the console by pressing a button
function initFromCSV()
{   
    
    // Reset class objects containers
    Actions = [];
    Tasks = [];
    Semaphores =[];
    SemaphoreGroups = [];
    Mutexes = [];

    console.log("test")
    console.log(arrayFromCSV)

    convertToObjectBaseValue(arrayFromCSV);
    createSemaphoreObjects();
    createSemaphoreGroupObjects();
    createMutexObjects();
    createActionObjects();
    createTaskObjects();

    // enable Simulation
    document.getElementById("simulator").disabled = false;
    document.getElementById("timer").disabled = false;
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


// remove duplicates from Array
//SRC: https://www.naukri.com/learning/articles/remove-duplicates-javascript-array/
function removeDuplicates(arr) 
{
    return arr.filter((item, index) => arr.indexOf(item) === index)
}

//================================================================================================

function convertToObjectBaseValue(convertedCSVArray)
{

    // Clear all arrays needed for this function
    actionArray = [];
    taskArray = [];
    semaphoreArray = [];
    mutexArray = [];
    mutexActionArray = [];
    semaphoreGroupArray = [];

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
        mutexArray.push(convertedCSVArray[i][15]);

        //=================== creating the Mutex-Action Array =========================
        // clearing the temp Array
        tempArray = [];
        for(let j = tableValueLocation[6][2] - 1; j <= tableValueLocation[7][2] - 1; j++)
        {
            tempArray.push(convertedCSVArray[i][j]);
        }
        mutexActionArray.push(tempArray)
    
        //=================== creating the Semaphore Group Array =========================
        semaphoreGroupArray.push(convertedCSVArray[i][11]);
    }
    mutexArray = removeDuplicates(mutexArray);
    semaphoreGroupArray = removeDuplicates(semaphoreGroupArray);

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
            let validSemaphoreID = false
            let validSemaphoreStart = false;
            let validSemaphoreEnd = false;
            let validSemaphoreCombined
            for(let j = 0; j < actionArray.length; j++)
            {
                
                if(parseInt(semaphoreArray[i][1]) == parseInt(actionArray[j][0]))
                {
                    validSemaphoreStart = true;
                }
                if( parseInt(semaphoreArray[i][2]) == parseInt(actionArray[j][0]))
                {
                    validSemaphoreEnd = true;
                }
                if(isNaN(parseInt(semaphoreArray[i][0])))
                {
                    validSemaphoreID = true;
                }
                if(isNaN(parseInt(semaphoreArray[i][3])))
                {
                    validSemaphoreCombined = true;
                }
            }
            if(validSemaphoreID)
            {
                let note = "ID of Semaphore with ID " + semaphoreArray[i][0] + " is invalid"
                addNewMessage("WARNING", note, "y")
            }
            if (!validSemaphoreStart || !validSemaphoreEnd)
            {
                let note = "Semaphore with ID " + semaphoreArray[i][0] + " has invalid Connection Points"
                addNewMessage("WARNING", note, "y");
            }
            if(validSemaphoreCombined)
            {
                let note = "Combination of Semaphore with ID " + semaphoreArray[i][0] + " is invalid"
                addNewMessage("WARNING", note, "y")
            }
            if(!validSemaphoreID || validSemaphoreStart || validSemaphoreEnd || !validSemaphoreCombined){
            // get the semaphore ID and initial Value from the Semaphore Array
            Semaphores.push(new Semaphore(parseInt(semaphoreArray[i][0]),
                                        parseInt(semaphoreArray[i][4]),
                                        parseInt(semaphoreArray[i][3]),
                                        parseInt(semaphoreArray[i][1]),
                                        parseInt(semaphoreArray[i][2])))
            }
        }
    }
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
        if(!(semaphoreGroupArray[i]==="" || semaphoreGroupArray[i]==="\r"))
        {
            if (semaphoreGroupArray[i].search("\r") != -1)
            {
                semaphoreGroupArray[i] = semaphoreGroupArray[i].match(/\d+/)[0];
            }
            let tempArray = [];
            for(let j = 0; j < Semaphores.length; j++)
            {
                if(Semaphores[j].group == parseInt(semaphoreGroupArray[i]))
                {
                    tempArray.push(Semaphores[j]);
                }
            }

            SemaphoreGroups.push(new SemaphoreGroup(parseInt(semaphoreGroupArray[i][0]),tempArray))
        }
    }
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
        if(!(mutexArray[i]==="") && !isNaN(parseInt(mutexArray[i])))
        {
            // get the Mutex ID and initial Value from the Mutex Array
            Mutexes.push(new Mutex(parseInt(mutexArray[i])))
        }
        else if(!(mutexArray[i]==="") && isNaN(parseInt(mutexArray[i])))
        {
            let note = "ID of Mutex with ID " + mutexArray[i] + " is invalid";
            addNewMessage("WARNING", note, "y");
        }
    }
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
                                let oldLength = mutexList.length;
                                mutexList.push(Mutexes[l]);
                                mutexList = removeDuplicates(mutexList)

                                if(oldLength === mutexList.length)
                                {
                                    let note = "Action with ID " + actionArray[i][0] + " has multiple connections to Mutex with ID " + Mutexes[l].id;
                                    addNewMessage("WARNING", note, "y"); 
                                }
                            }
                        }
                    }
                }
            }

            // This Codeblock determines whether an Action is valid by checking its dependency on Tasks
            let actionValid = false;
            for(let j = 0; j < taskArray.length; j++)
            {
                if(parseInt(taskArray[j][0])==parseInt(actionArray[i][2]))
                {
                    actionValid = true;
                }
            }

            if(!actionValid)
            {
                let note = "Action " + actionArray[i][0] + " cant be created due to missing or wrong values";
                addNewMessage("WARNING ",note,"y");
            }
            // create Actions if its valid
            else
            {
                if(actionArray[i][3] == String(parseInt(actionArray[i][3])))
                {
                    Actions.push(new Action(parseInt(actionArray[i][0]),
                                                actionArray[i][1], 
                                                parseInt(actionArray[i][3]), 
                                                semaphoreGroupIn, 
                                                semaphoreOut, 
                                                mutexList,
                                                parseInt(actionArray[i][2])))
                }
                else
                {
                    let note = "Action with ID " + actionArray[i][0] + " has StepValue as mathematical expression";
                    addNewMessage("WARNING",note,"y");
                    Actions.push(new Action(parseInt(actionArray[i][0]),
                                                actionArray[i][1], 
                                                parseInt(actionArray[i][3]), 
                                                semaphoreGroupIn, 
                                                semaphoreOut, 
                                                mutexList,
                                                parseInt(actionArray[i][2])))
                }
                
            }
        }
    }
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
            if(!isNaN(parseInt(taskArray[i][0])))
            {
                Tasks.push(new Task(parseInt(taskArray[i][0]),taskArray[i][1],tempActionArray))
            }
            else
            {
                let note = "ID for Task with ID " + taskArray[i][0] + " is invalid"
                addNewMessage("WARNING", note, "y")
            }
            
        }
    }
}






