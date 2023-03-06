const StepButton = document.getElementById('step');

function Step(){
    Actions.forEach(element => 
        {
            if(element.isrunnuing === true)
            {
                console.log(element.actionID.toString() + " is running")
            }
            else
            {
                console.log(element.actionID.toString() + " is not running")
                if(element.checkRessources() === true)
                {
                    element.startAction()
                }
                else
                {
                    None
                }
            }
        })
}

StepButton.addEventListener('click',Step)