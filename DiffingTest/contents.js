let PageTest={
    src:"PageTest.html",
    type:"page",
    name:"Page-Test"
}


let atomDeneme={
    type:"atom",
    name:"atom-deneme",
    data:()=>{
        return x%5
    }
}

window.x = 1 ;
window.y = 0 ; 
window.z = 100;


dataSet.value.push("x","y","z");
let contents=[PageTest,atomDeneme];

