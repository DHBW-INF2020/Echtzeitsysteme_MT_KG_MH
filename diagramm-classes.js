
//=====================================================================================================================================

class Task{
    constructor(id, task_name, actions)
    {
        this.id = id;
        this.name = task_name;
        this.actions = actions;
    }
}


//=====================================================================================================================================


// Helper: 
// Action(
//    int: id, 
//    string: action_name, 
//    int: action_steps, 
//    Semaphore Array: semaphores_in, 
//    Semaphore Array:semaphores_out, 
//    Mutex Array:mutex_list
//    )
class Action{
    constructor(id, action_name, action_steps, semaphore_group_in, semaphores_out, mutex_list)
    {
        // necessary input for class generation
        this.id = id;
        this.name = action_name;
        this.steps = action_steps;
        this.semaphoreGroupIn = semaphore_group_in;
        this.semaphoresOut = semaphores_out;
        this.mutexList = mutex_list;

        // setting other variables
        this.currentSteps = 0;
        this.running = false;
    }

    /**
    * Function Name. takeStep()  
    * Summary. 
    * This Function is responsible for taking the Action through a simulation step
    * if the action is running check if the action is finished
    * if the action is not running try to start it
    *
    *
    * @author.     MH
    *
    */
    takeStep()
    {
        if(this.running)
        {
            if(this.currentSteps == this.steps)
            {
                this.stopAction();
            }
            else
            {
                this.currentSteps = this.currentSteps + 1; 
            }
        }
        else
        {
            this.startAction();
        }
    }


    /**
    * Function Name. startAction()  
    * Summary. 
    * This Function readies an Action and connected Semaphores and Mutexes for active simulation
    *
    *
    * @author.     MH
    * @return.     bool -> true if action was able to start
    */
    startAction()
    {
        let startPossible = false;
        for(let j = 0; j < this.semaphoreGroupIn.length; j++)
        {
            let tempVal = 0;
            if(this.semaphoreGroupIn[j].combinedSemaphoreValue()>0)
            {
                tempVal = tempVal + 1;
            }
            if(tempVal == this.semaphoreGroupIn.length)
            {
                startPossible = true;
            }
        }

        if(startPossible && this.takeResources())
        {
            this.currentSteps = 0;
            this.running = true;

            // consume Semaphore Values
            for(let i = 0; i < this.semaphoreGroupIn.length; i++)
            {
                this.semaphoreGroupIn[i].decrementSemaphoreGroup();
            }
            console.log("Action ", this.id, " started")
        }
        return startPossible;
    }


    /**
    * Function Name. stopAction()  
    * Summary. This Function is responsible for taking the Action through a simulation step
    *
    * Description. (use period)
    *
    * @author.     MH
    *
    */
    stopAction()
    {
        // increment outgoing Semaphores
        for(let i = 0; i < this.semaphoresOut.length; i++)
        {
            this.semaphoresOut[i].up()
        }
        // release Mutexes
        this.releaseResources();
        this.currentSteps = 0;
        this.running = false;
        console.log("Action ", this.id, " stopped")
        return true;
    }


    /**
    * Function Name. checkResources()  
    * Summary. 
    * This Function checks if all connected Mutexes are available 
    *
    *
    * @author.     MH
    * @return.      bool -> true if all Mutexes are available
    */
    checkResources()
    {
        let resAvailable = false;
        for(let i = 0; i < this.mutexList.length; i++)
        {
            if(this.mutexList[i].available)
            {
                resAvailable = true;
            }
            else
            {
                resAvailable = false;
            }
        }
        console.log("Mutex available: ", resAvailable);
        return resAvailable;
    }


    /**
    * Function Name. takeResources()  
    * Summary.
    * This takes all connected Mutexes if possible
    *
    *
    * @author.     MH
    * @return.     bool -> true if action was able to take all needed Resources
    */
    takeResources()
    {
        let successful = false;
        if(this.checkResources())
        {
            for(let i = 0; i < this.mutexList; i++)
            {
                this.mutexList[i].down();
                console.log("Mutex ",this.mutexList[i].id, "taken by", this.id);
            }

            successful = true;
            
        }
        return successful;
    }


    /**
    * Function Name. releaseResources()  
    * Summary.
    * This function will release all Mutexes of an Action
    * 
    * Call after Action has concluded
    *
    * @author.     MH
    *
    */
    releaseResources()
    {
        for(let i = 0; i < this.mutexList; i++)
        {
            this.mutexList[i].up();
        }
    }
}

//=====================================================================================================================================
class SemaphoreGroup
{
    constructor(id, semaphores)
    {
        this.id = id;
        this.semaphores = semaphores;
    }

    /**
    * Function Name. combinedSemaphoreValue()  
    * Summary. 
    * This Function adds up all the Values of a Semaphore Group
    * if return (tempValue) is > 0 the next Action can be triggered from this Semaphore  
    *
    * @author.     MH
    *
    */
    combinedSemaphoreValue()
    {
        let tempValue = 0;
        for(let i = 0; i < this.semaphores.length; i ++)
        {
            tempValue = tempValue + this.semaphores[i].value;
        }
        return parseInt(tempValue)
    }

    /**
    * Function Name. decrementSemaphoreGroup()  
    * Summary. 
    * This Function is a helper to decrement all Semaphores in a Semaphore Group if an Action is started
    *
    * @author.     MH
    *
    */
    decrementSemaphoreGroup()
    {
        // Decrement each Semaphore Value
        for(let i = 0; i < this.semaphores.length; i ++)
        {
            this.semaphores[i].down(); 
        }
    }
}


class Semaphore
{
    constructor(id, semaphore_value, semaphore_group, starting_point, end_point)
    {
        // handle Input
        this.id = id;
        this.value = semaphore_value;
        this.group = semaphore_group;
        this.startingpoint = starting_point;
        this.endpoint = end_point;
    }


    up()
    {
        this.value = this.value + 1;
    }


    down()
    {
        if(this.value > 0)
        {
            this.value = this.value - 1;
        }
        else
        {
            console.log("DEBUG: Semaphore already 0");
        }
    }
}

//=====================================================================================================================================

class Mutex
{
    constructor(id)
    {
        // handle input
        this.id = id;

        // default values
        this.available = true;
    }

    /**
    * Function Name. up()  
    * Summary. This Function makes a Mutex available for other tasks
    *
    * @author.     MH
    *
    */
    up()
    {
        this.available = true;
    }

    /**
    * Function Name. down()  
    * Summary. This Function makes a Mutex unavailable for other Tasks
    *
    * @author.     MH
    *
    */
    down()
    {
        this.available = false;
    }
}