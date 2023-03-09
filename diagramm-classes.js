
//=====================================================================================================================================

class Task{
    constructor(id, task_name, actions)
    {
        this.taskID = id;
        this.taskName = task_name;
        this.taskActions = actions;
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
        this.actionID = id;
        this.actionName = action_name;
        this.actionSteps = action_steps;
        this.actionSemaphoreGroupIn = semaphore_group_in;
        this.actionSemaphoresOut = semaphores_out;
        this.actionMutexList = mutex_list;

        // setting other variables
        this.currentSteps = 0;
        this.running = false;
    }

    /**
    * Function Name. takeStep()  
    * Summary. This Function is responsible for taking the Action through a simulation step
    *
    * Description. (use period)
    *
    * @author.     MH
    *
    */
    takeStep()
    {

    }


    /**
    * Function Name. startAction()  
    * Summary. This Function is responsible for taking the Action through a simulation step
    *
    * Description. (use period)
    *
    * @author.     MH
    *
    */
    startAction()
    {

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

    }


    /**
    * Function Name. checkResources()  
    * Summary. This Function is responsible for taking the Action through a simulation step
    *
    * Description. (use period)
    *
    * @author.     MH
    *
    */
    checkResources()
    {

    }


    /**
    * Function Name. takeResources()  
    * Summary. This Function is responsible for taking the Action through a simulation step
    *
    * Description. (use period)
    *
    * @author.     MH
    *
    */
    takeResources()
    {

    }


    /**
    * Function Name. releaseResources()  
    * Summary. This Function is responsible for taking the Action through a simulation step
    *
    * Description. (use period)
    *
    * @author.     MH
    *
    */
    releaseResources()
    {

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
}


class Semaphore
{
    constructor(id, semaphore_value, semaphore_group)
    {
        // handle Input
        this.semaphoreID = id;
        this.semaphoreValue = semaphore_value;
        this.semaphoreGroup = semaphore_group;
    }


    up()
    {
        this.semaphoreValue = this.semaphoreValue + 1;
    }


    down()
    {
        this.semaphoreValue = this.semaphoreValue - 1;
    }
}

//=====================================================================================================================================

class Mutex
{
    constructor(id)
    {
        // handle input
        this.mutexID = id;

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