const ACTIVE_SEMAPHORE_COLOR = "green"
const PASSIVE_SEMAPHORE_COLOR = "black"
const AVAILABLE_MUTEX_COLOR = "lightgreen"
const UNAVAILABLE_MUTEX_COLOR = "lightgray"

const goMake = go.GraphObject.make;

diagram =
    goMake(go.Diagram,
        "myDiagramDiv",
        {
            //layout: make(go.TreeLayout, { setsPortSpot: false, setsChildPortSpot: false, isRealtime: false })
            initialAutoScale: go.Diagram.Uniform,  // zoom to make everything fit in the viewport
            layout: goMake(go.ForceDirectedLayout,  // automatically spread nodes apart
                { maxIterations: 200, defaultSpringLength: 30, defaultElectricalCharge: 100 , randomNumberGenerator: null}
            )
        }
);

// Disable the intital fade animation which is shown when loading the diagram
diagram.animationManager.initialAnimationStyle = go.AnimationManager.None;

// Define the task node
diagram.nodeTemplateMap.add("Task",
    goMake(go.Node, 
        "Vertical",
        { defaultStretch: go.GraphObject.Horizontal },

        goMake(go.Panel, 
            "Auto",
            goMake(go.Shape, 
                "RoundedTopRectangle",
                { fill: "white" }),
            goMake(go.TextBlock,
                { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
                new go.Binding("text", "task"))
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

// Define the mutex node
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

// Define the semaphore links
diagram.linkTemplateMap.add("SemaphoreLink",
    goMake(go.Link,
        //{ routing: go.Link.AvoidsNodes, corner: 10 },
        { curve: go.Link.Bezier },
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

// Create a dummy model
diagram.model = new go.GraphLinksModel([
    { key: 1, task: "Task 1", activity: "Aktivität 1", steps:"5", category:"Task" },
    { key: 2, task: "Task 1", activity: "Aktivität 2", steps:"3", category:"Task" },
    { key: 3, task: "Task 2", activity: "Aktivität 3", steps:"3", category:"Task" },
    { key: 4, isAvailable: true, category:"Mutex" },
    { key: 5, isAvailable: false, category:"Mutex" },
    { key: 6, category:"SemaphoreOrNode" }
], [
    { from: 1, to: 2, isActive: true, category: "SemaphoreLink", count: "5" },
    { from: 2, to: 1, isActive: false, category: "SemaphoreLink", count: "0" },
    { from: 1, to: 6, isActive: false, category: "SemaphoreLink", count: "0" },
    { from: 3, to: 6, isActive: false, category: "SemaphoreLink", count: "0" },
    { from: 6, to: 2, isActive: false, category: "SemaphoreLink", count: "0" },
    { from: 1, to: 4, category: "MutexLink" },
    { from: 2, to: 4, category: "MutexLink" },
    { from: 1, to: 5, category: "MutexLink" },
    { from: 2, to: 5, category: "MutexLink" }
]);

console.log("Loaded gojs-viewer.js")