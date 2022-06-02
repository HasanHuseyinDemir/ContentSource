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

window.args="Merhaba";

dataSet.value.push("x","y","z","args");

let watched = new watch(["y","x"],()=>alert());

watchlist.push(watched);

//setInterval(()=>{v()},300);


let contents=[PageTest,atomDeneme];

