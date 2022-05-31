let PageTest={
    src:"PageTest.html",
    type:"static-page",
    name:"Page-Test"
}
let DenemeSayfa={
    src:"DenemeSayfa.html",
    type:"page",
    name:"Deneme-sayfa",
}
let BaskaSayfa={
    src:"baskaSayfa.html",
    type:"page",
    name:"Baska-Sayfa",
}

let atomDeneme={
    type:"atom",
    name:"atom-deneme",
    data:()=>{
        return x%5
    }
}

let x = 0 ;
let y = 0 ; 

let contents=[PageTest,DenemeSayfa,BaskaSayfa,atomDeneme];

