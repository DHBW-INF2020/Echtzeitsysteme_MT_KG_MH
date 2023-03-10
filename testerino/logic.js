const StepButton = document.getElementById('step');


let connections = []

function Step(){
    let actions = []
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
        actions.push({key: element.id.toString(), activity: element.name.toString(), steps: element.currentSteps.toString(), category: "Task"})
        })
    console.log(actions)
    let mutexes = []
    Mutexes.forEach(element => 
        {
            mutexes.push({ key: element.id.toString(), isAvailable: element.available.toString(), category:"Mutex" })
        })  
    console.log(mutexes)  
}

StepButton.addEventListener('click',Step)