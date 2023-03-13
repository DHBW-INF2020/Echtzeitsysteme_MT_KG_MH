
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

 /**
    * Class Name. Action()  
    * Summary. 
    * This Class describes an Action 
    * The Logic of the Model is implemented in the Actions Functions
    * 
    * @attributes.
    * id (int) -> the ID of the Action
    * name (string) -> Action Name
    * steps (int) -> the total amount of steps that are needed for the action
    * semaphoreGroupIn (Arr Obj) -> a Group of Semaphores that go into the Action 
    * SemaphoresOut (Arr Obj) -> All Semaphores that go out of the Action (will be incremented when Action concludes)
    * mutexList (Arr Obj) -> All Mutexes that are connected to this Task
    * taskAssignment (int) -> indicates the Parent Task of an Action
    * 
    * currentSteps (int) -> indicates at which point the Action is in its execution
    * running (bool) -> indicates if an Action is Running
    *
    * @author.     MH
    *
    */
class Action{
    constructor(id, action_name, action_steps, semaphore_group_in, semaphores_out, mutex_list,task_assigned)
    {
        // necessary input for class generation
        this.id = id;
        this.name = action_name;
        this.steps = action_steps;
        this.semaphoreGroupIn = semaphore_group_in;
        this.semaphoresOut = semaphores_out;
        this.mutexList = mutex_list;
        this.taskAssignment = task_assigned;

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
        

        let tempVal = 0;
        for(let j = 0; j < this.semaphoreGroupIn.length; j++)
        {
            
            this.semaphoreGroupIn[j].combinedSemaphoreValue()
            if(this.semaphoreGroupIn[j].combinedGrpValue>0)
            {
                tempVal = tempVal + 1;
            }
            
        }
        console.log("test",tempVal,this.semaphoreGroupIn.length,"ID: ", this.id);
            if(tempVal == this.semaphoreGroupIn.length)
            {
                startPossible = true;
            }
        console.log("start possible:",startPossible, "checking Mutexes")
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
        for(let j =0; j < this.semaphoreGroupIn.length; j++)
        {
            this.semaphoreGroupIn[j].combinedSemaphoreValue();
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
        console.log("test check Res", this.mutexList.length);
        if(this.mutexList.length == 0)
        {
            resAvailable = true;
        }
        else
        {
            for(let i = 0; i < this.mutexList.length; i++)
            {
                console.log("individual Mutex List: ",this.mutexList[i].available);
                if(this.mutexList[i].available)
                {
                    resAvailable = true;
                }
                else
                {
                    resAvailable = false;
                }
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
            for(let i = 0; i < this.mutexList.length; i++)
            {
                this.mutexList[i].down();
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
        for(let i = 0; i < this.mutexList.length; i++)
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
        this.combinedGrpValue = 0;
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
        this.combinedGrpValue = parseInt(tempValue);
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