
const simulationButton = document.getElementById('simulator');
simulationButton.addEventListener('click', testSimulation);

function testSimulation()
{
    for(let i = 0; i < Actions.length; i ++)
    {
        Actions[i].takeStep();
    }
}