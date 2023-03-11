const ACTIVE_TASK_COLOR = "lightgreen"
const PASSIVE_TASK_COLOR = "white"
const ACTIVE_SEMAPHORE_COLOR = "green"
const PASSIVE_SEMAPHORE_COLOR = "black"
const AVAILABLE_MUTEX_COLOR = "lightgreen"
const UNAVAILABLE_MUTEX_COLOR = "lightgray"

const goMake = go.GraphObject.make;

// This class is used to override the random generator of the gojs layouter
class StaticNumberGenerator{
    random(){
        return 1;
    }
}

staticNumberGenerator = new StaticNumberGenerator();

function createDigramFromScratch(){
    diagram =
        goMake(go.Diagram,
            "myDiagramDiv",
            {
                //layout: make(go.TreeLayout, { setsPortSpot: false, setsChildPortSpot: false, isRealtime: false })
                initialAutoScale: go.Diagram.Uniform,  // zoom to make everything fit in the viewport
                // layout: goMake(go.ForceDirectedLayout,  // automatically spread nodes apart
                //     { maxIterations: 1000, defaultSpringLength: 300, defaultElectricalCharge: 10 , randomNumberGenerator: staticNumberGenerator}
                // )
                layout: goMake(go.LayeredDigraphLayout, 
                    { alignOption: go.LayeredDigraphLayout.AlignAll, layerSpacing: 50, iterations: 4, setsPortSpots: false}
                )
            }
        );
    // Disable the intital fade animation which is shown when loading the diagram
    diagram.animationManager.initialAnimationStyle = go.AnimationManager.None;
    return diagram;
}

function createTaskTemplate(diagram){
    // Define the task node
    diagram.nodeTemplateMap.add("Task",
        goMake(go.Node, 
            "Vertical",
            { defaultStretch: go.GraphObject.Horizontal },

            goMake(go.Panel, 
                "Auto",
                goMake(go.Shape, 
                    "RoundedTopRectangle",
                    new go.Binding("fill", "isActive", x => x == true ? ACTIVE_TASK_COLOR : PASSIVE_TASK_COLOR) 
                ),
                goMake(go.TextBlock,
                    { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
                    new go.Binding("text", "task")
                )
            ),

            goMake(go.Panel, 
                "Auto",
                { minSize: new go.Size(NaN, 70) },
                goMake(go.Shape, 
                    "Rectangle", 
                    { fill: "white" }),
                goMake(go.TextBlock,
                    { width: 120 },
                    { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
                    new go.Binding("text", "activity"))
            ),

            goMake(go.Panel, 
                "Auto",
                goMake(go.Shape, 
                    "RoundedBottomRectangle", 
                    { fill: "white" }),
                goMake(go.TextBlock,
                    { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
                    new go.Binding("text", "steps"))
            )
        )
    );
}

function createMutexTemplate(diagram){
    // Define the mutex node
    diagram.nodeTemplateMap.add("Mutex",
        goMake(go.Node, 
            "Vertical",
            { defaultStretch: go.GraphObject.Horizontal },

            goMake(go.Panel, 
                "Auto",
                { maxSize: new go.Size(60, 50) },
                goMake(go.Shape, 
                    "hexagon",
                    {angle: 90},
                    new go.Binding("fill", "isAvailable", x => x == true ? AVAILABLE_MUTEX_COLOR : UNAVAILABLE_MUTEX_COLOR))
            ),
        )
    );
}

function createSempahoreOrNodeTemplate(diagram){
    // Define the "sempahore or node"
    diagram.nodeTemplateMap.add("SemaphoreOrNode",
        goMake(go.Node, 
            "Vertical",
            { defaultStretch: go.GraphObject.Horizontal },

            goMake(go.Panel, 
                "Auto",
                { maxSize: new go.Size(5, 5) },
                goMake(go.Shape, 
                    "Ellipse",
                    {width:1, height:1},
                    new go.Binding("fill", "isAvailable", x => x == true ? AVAILABLE_MUTEX_COLOR : UNAVAILABLE_MUTEX_COLOR))
            ),
        )
    );
}

function createSemaphoreLink(diagram){
    // Define the semaphore links
    diagram.linkTemplateMap.add("SemaphoreLink",
        goMake(go.Link,
            //{ routing: go.Link.AvoidsNodes, corner: 10 },
            //{ curve: go.Link.Bezier },
            goMake(go.Shape, 
                new go.Binding("stroke", "isActive", x => x == true ? ACTIVE_SEMAPHORE_COLOR : PASSIVE_SEMAPHORE_COLOR)
            ),
            goMake(go.Shape, 
                { toArrow: "Triangle", stroke:null, strokeWidth: 3},
                new go.Binding("fill", "isActive", x => x == true ? ACTIVE_SEMAPHORE_COLOR : PASSIVE_SEMAPHORE_COLOR)    
            ),
            goMake(go.TextBlock,
                { segmentOffset: new go.Point(0, 10) },
                new go.Binding("text", "count")
            )
        )
    );
}

function createMutexLink(diagram){
    // Define the mutex links
    diagram.linkTemplateMap.add("MutexLink",
        goMake(go.Link,
            //{ routing: go.Link.AvoidsNodes, corner: 10 },
            { curve: go.Link.Bezier},
            goMake(go.Shape, 
                new go.Binding("stroke", "isActive", x => x == true ? ACTIVE_SEMAPHORE_COLOR : PASSIVE_SEMAPHORE_COLOR),
                { strokeDashArray:[5,2] }
            ),
            goMake(go.Shape, 
                { toArrow: false, stroke:null},
                new go.Binding("fill", "isActive", x => x == true ? ACTIVE_SEMAPHORE_COLOR : PASSIVE_SEMAPHORE_COLOR)    
            )
        )
    );
}

function createExample(diagram){
    // Create a dummy model
    diagram.model = new go.GraphLinksModel([
        { key: 0, task: "Task 1", activity: "Aktivität 1", steps:"5", category:"Task" },
        { key: 2, task: "Task 1", activity: "Aktivität 2", steps:"3", category:"Task" },
        { key: 3, task: "Task 2", activity: "Aktivität 3", steps:"3", category:"Task" },
        { key: 4, isAvailable: true, category:"Mutex" },
        { key: 5, isAvailable: false, category:"Mutex" },
        { key: 6, category:"SemaphoreOrNode" }
    ], [
        { from: 0, to: 2, isActive: true, category: "SemaphoreLink", count: "5" },
        { from: 2, to: 0, isActive: false, category: "SemaphoreLink", count: "0" },
        { from: 0, to: 6, isActive: false, category: "SemaphoreLink", count: "0" },
        { from: 3, to: 6, isActive: false, category: "SemaphoreLink", count: "0" },
        { from: 6, to: 2, isActive: false, category: "SemaphoreLink", count: "0" },
        { from: 0, to: 4, category: "MutexLink" },
        { from: 2, to: 4, category: "MutexLink" },
        { from: 0, to: 5, category: "MutexLink" },
        { from: 2, to: 5, category: "MutexLink" }
    ]);
}

function addTaskNodes(nodes){
    for(taskNum = 0; taskNum < Tasks.length; taskNum++){
        currentTask = Tasks[taskNum];
        actions = currentTask.actions;

        for(actionNum = 0; actionNum < actions.length; actionNum++){
            currentAction = actions[actionNum];
            nodes.push(
                {
                    key: "a"+currentAction.id, 
                    task: currentTask.name,
                    activity: currentAction.name,
                    steps: currentAction.steps,
                    isActive: currentAction.running,
                    category: "Task"
                }
            );
        }
    }
}

function addMutexNodes(nodes){
    for(MutexNum = 0; MutexNum < Mutexes.length; MutexNum++){
        currentMutex = Mutexes[MutexNum];
        nodes.push(
            {
                key: "m"+currentMutex.id, 
                isAvailable: currentMutex.available, 
                category:"Mutex" 
            }
        )
    }
}

function addSempahoreLinksAndNodes(nodes, links){
    for(semaphoreGroupNum = 0; semaphoreGroupNum < SemaphoreGroups.length; semaphoreGroupNum++)
    {
        semaphores = SemaphoreGroups[semaphoreGroupNum].semaphores
        if(semaphores.length == 1){
            currentSemaphore = semaphores[0];
            links.push(
                {
                    from: "a"+currentSemaphore.startingpoint, 
                    to: "a"+currentSemaphore.endpoint,
                    isActive: (currentSemaphore.value > 0),
                    count: currentSemaphore.value,
                    category: "SemaphoreLink"
                }
            );
        }
        else{
            semaphoreOrNodeKey = "s"+semaphoreGroupNum;
            nodes.push(
                {
                    key: semaphoreOrNodeKey,
                    category: "SemaphoreOrNode"
                }
            );
            
            currentSemaphore = 0;
            for(semaphoreNum = 0; semaphoreNum < semaphores.length; semaphoreNum++)
            {
                currentSemaphore = semaphores[semaphoreNum];
                links.push(
                    {
                        from: "a"+currentSemaphore.startingpoint, 
                        to: semaphoreOrNodeKey,
                        isActive: (currentSemaphore.value > 0),
                        count: currentSemaphore.value,
                        category: "SemaphoreLink"
                    }
                );
            } 

            links.push(
                {
                    from: semaphoreOrNodeKey, 
                    to: "a"+currentSemaphore.endpoint,
                    isActive: (0 > 0), // It needs a variable
                    count: 0, // It needs a variable
                    category: "SemaphoreLink"
                }
            );
        }
    }
}

function getMutexLinks(links){
    for(actionNum = 0; actionNum < Actions.length; actionNum++){
        currentAction = Actions[actionNum];
        currentMutexList = currentAction.mutexList;
        
        if(currentMutexList.length > 0){
            for(mutexNum = 0; mutexNum < currentMutexList.length; mutexNum++){
                currentMutex = currentMutexList[mutexNum];
                links.push(
                    {
                        from: "a"+currentAction.id, 
                        to: "m"+currentMutex.id,
                        category: "MutexLink"
                    }
                );
            }
        }
    }
}

function showDiagram(diagram){
    nodes = [];
    links = [];

    addTaskNodes(nodes);
    addMutexNodes(nodes);
    addSempahoreLinksAndNodes(nodes, links);    
    getMutexLinks(links);

    console.log("nodes", nodes)
    console.log("links", links)
    diagram.model = new go.GraphLinksModel(nodes, links)
}

function createDiagram(){
    diagram = createDigramFromScratch();
    createTaskTemplate(diagram);
    createMutexTemplate(diagram);
    createSempahoreOrNodeTemplate(diagram);
    createSemaphoreLink(diagram);
    createMutexLink(diagram);
    return diagram
}

console.log("Loaded gojs-viewer.js")