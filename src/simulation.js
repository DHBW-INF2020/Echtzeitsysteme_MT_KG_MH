
const simulationButton = document.getElementById('simulator');
simulationButton.addEventListener('click', testSimulation);

const timerStopStart = document.getElementById('timer');
timerStopStart.addEventListener('click', startTimedSimulation)

const slider = document.getElementById("slider");

const intervalSpeed = document.getElementById("interval-indicator")

diagram = null;

function initProgram(){
    console.log("initProgram");
    diagram = createDiagram();
    // disable all Buttons until they are enabled
    document.getElementById("convert-csv").disabled = true;
    document.getElementById("simulator").disabled = true;
    document.getElementById("timer").disabled = true;
}

function testSimulation()
{
    for(let i = 0; i < Actions.length; i ++)
    {
        Actions[i].takeStep();
    }
    showDiagram(diagram);
}

let timedSimulationRunning = false;
let intervalID = 0;
let intervalLength = 0;
function startTimedSimulation()
{   
    intervalLength = 1000 / slider.value;
    if(!timedSimulationRunning)
    {
        timerStopStart.innerHTML = "Stop Simulation"
        intervalID = setInterval(testSimulation, intervalLength);
        timedSimulationRunning = true;
    }
    else
    {
        timerStopStart.innerHTML = "Start Simulation"
        clearInterval(intervalID);
        timedSimulationRunning = false;
    }
    
}


slider.onchange = function()
{
    intervalLength = 1000 / slider.value;
    if(intervalID)
    {
        clearInterval(intervalID);
        if(timedSimulationRunning)
        {
            intervalID = setInterval(testSimulation, intervalLength);
        }
    }

    let note = parseInt(intervalLength) + " Millisekunden pro Schritt"
    intervalSpeed.innerHTML = note;
}