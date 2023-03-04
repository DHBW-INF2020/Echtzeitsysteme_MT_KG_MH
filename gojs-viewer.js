const ACTIVE_SEMAPHORE_COLOR = "green"
const PASSIVE_SEMAPHORE_COLOR = "black"
const AVAILABLE_MUTEX_COLOR = "lightgreen"
const UNAVAILABLE_MUTEX_COLOR = "lightgray"

const make = go.GraphObject.make;


myDiagram =
    make(go.Diagram,
        "myDiagramDiv",
        {
            layout: make(go.TreeLayout, { setsPortSpot: false, setsChildPortSpot: false, isRealtime: false })
        }
);

// Define the task node
myDiagram.nodeTemplateMap.add("Task",
    make(go.Node, 
        "Vertical",
        { defaultStretch: go.GraphObject.Horizontal },

        make(go.Panel, 
            "Auto",
            make(go.Shape, 
                "RoundedTopRectangle",
                { fill: "white" }),
            make(go.TextBlock,
                { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
                new go.Binding("text", "task"))
        ),

        make(go.Panel, 
            "Auto",
            { minSize: new go.Size(NaN, 70) },
            make(go.Shape, 
                "Rectangle", 
                { fill: "white" }),
            make(go.TextBlock,
                { width: 120 },
                { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
                new go.Binding("text", "activity"))
        ),

        make(go.Panel, 
            "Auto",
            make(go.Shape, 
                "RoundedBottomRectangle", 
                { fill: "white" }),
            make(go.TextBlock,
                { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
                new go.Binding("text", "steps"))
        )
    )
);

// Define the mutex node
myDiagram.nodeTemplateMap.add("Mutex",
    make(go.Node, 
        "Vertical",
        { defaultStretch: go.GraphObject.Horizontal },

        make(go.Panel, 
            "Auto",
            { minSize: new go.Size(60, 50), maxSize: new go.Size(60, 50) },
            make(go.Shape, 
                "StopSign", 
                new go.Binding("fill", "isAvailable", x => x == true ? AVAILABLE_MUTEX_COLOR : UNAVAILABLE_MUTEX_COLOR))
        ),
    )
);

// Define the semaphore links
myDiagram.linkTemplateMap.add("SemaphoreLink",
    make(go.Link,
        //{ routing: go.Link.AvoidsNodes, corner: 10 },
        { curve: go.Link.Bezier },
        make(go.Shape, 
            new go.Binding("stroke", "isActive", x => x == true ? ACTIVE_SEMAPHORE_COLOR : PASSIVE_SEMAPHORE_COLOR)
        ),
        make(go.Shape, 
            { toArrow: "Triangle", stroke:null, strokeWidth: 3},
            new go.Binding("fill", "isActive", x => x == true ? ACTIVE_SEMAPHORE_COLOR : PASSIVE_SEMAPHORE_COLOR)    
        ),
        make(go.TextBlock,
            { segmentOffset: new go.Point(0, 10) },
            new go.Binding("text", "count")
        )
    )
);

// Define the mutex links
myDiagram.linkTemplateMap.add("MutexLink",
    make(go.Link,
        //{ routing: go.Link.AvoidsNodes, corner: 10 },
        { curve: go.Link.Bezier },
        make(go.Shape, 
            new go.Binding("stroke", "isActive", x => x == true ? ACTIVE_SEMAPHORE_COLOR : PASSIVE_SEMAPHORE_COLOR)
        ),
        make(go.Shape, 
            { toArrow: false, stroke:null},
            new go.Binding("fill", "isActive", x => x == true ? ACTIVE_SEMAPHORE_COLOR : PASSIVE_SEMAPHORE_COLOR)    
        )
    )
);

// Create a dummy model
myDiagram.model = new go.GraphLinksModel([
    { key: 1, task: "Task 1", activity: "Aktivität 1", steps:"5", category:"Task" },
    { key: 2, task: "Task 1", activity: "Aktivität 2", steps:"3", category:"Task" },
    { key: 3, isAvailable: true, category:"Mutex" },
    { key: 4, isAvailable: false, category:"Mutex" }
], [
    { from: 1, to: 2, isActive: true, category: "SemaphoreLink", count: "5" },
    { from: 2, to: 1, isActive: false, category: "SemaphoreLink", count: "0" },
    { from: 1, to: 3, category: "MutexLink" },
    { from: 2, to: 3, category: "MutexLink" },
    { from: 1, to: 4, category: "MutexLink" },
    { from: 2, to: 4, category: "MutexLink" }
]);

console.log("Loaded gojs-viewer.js")