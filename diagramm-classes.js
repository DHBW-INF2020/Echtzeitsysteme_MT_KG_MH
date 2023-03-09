
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