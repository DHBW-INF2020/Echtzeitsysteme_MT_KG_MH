
const simulationButton = document.getElementById('simulator');
simulationButton.addEventListener('click', testSimulation);

const timerStopStart = document.getElementById('timer');
timerStopStart.addEventListener('click', startTimedSimulation)

diagram = null;

function initProgram(){
    console.log("initProgram");
    diagram = createDiagram();
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
function startTimedSimulation()

{   if(!timedSimulationRunning)
    {
        timerStopStart.innerHTML = "Stop Simulation"
        intervalID = setInterval(testSimulation, 1000);
        timedSimulationRunning = true;
    }
    else
    {
        timerStopStart.innerHTML = "Start Simulation"
        clearInterval(intervalID);
        timedSimulationRunning = false;
    }
    
}