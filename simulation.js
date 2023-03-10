
const simulationButton = document.getElementById('simulator');
simulationButton.addEventListener('click', testSimulation);
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