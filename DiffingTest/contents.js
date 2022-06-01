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

dataSet.value.push("x","y","z","args","zx");
let zx =0;
let xz =()=> zx%5;

let watched = new watch(["zx","xz"],()=>zx>6?console.log(zx+" 6 dan büyük"):console.log(zx+"  6 dan küçük"));

let XZ =new watch(["xz()"],()=>alert("Değişti!"));


watchlist.push(watched,XZ);

//setInterval(()=>{v()},300);


let contents=[PageTest,atomDeneme];

