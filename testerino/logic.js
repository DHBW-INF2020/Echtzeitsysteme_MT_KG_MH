const StepButton = document.getElementById('step');

function Step(){
    Actions.forEach(element => 
        {
            console.log(element)
            if(element.isrunnuing === true)
            { 
                console.log(element.name.toString() + " is running")
                if(element.steps === element.currentSteps)
                {
                    console.log(element.name.toString() + " just finished")
                    element.stop()
                    element.releaseRessources()
                }
                else
                {
                    console.log(element.name.toString() + " takes Step" + element.currentSteps.toString())
                    element.takeStep()
                }              
            }
            else
            {
                console.log(element.name.toString() + " is not running")
                if(element.checkResources() === true)
                {
                    console.log(element.name.toString() + " starts now")
                    element.takeRessources()
                    element.startAction()
                }
                else
                {
                    
                }
            }
        })
}

StepButton.addEventListener('click',Step)