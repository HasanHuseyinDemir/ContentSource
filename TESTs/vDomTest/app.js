let PageTest={
    src:"./page-test.html",
    type:"page",
    name:"PageTest",
}

let x = 0;
let y = 100;

let samplelist=["selam","ben","hasan"];
let merhaba = [{img:"https://i.pinimg.com/1200x/42/a9/69/42a969435ae3b717075c3c3b6d9f7152.jpg",title:"Resim1"},{img:"https://productimages.hepsiburada.net/s/40/1500/10650895351858.jpg",title:"Resim2"}]
let contents = [PageTest];

let price = 5
let quantity = 2
let total=()=>{return price*quantity};



console.log(`total is ${total()}`)

window.yeniSayfa={
    src:"./YeniSayfa.html",
    type:"page",
    name:"YeniSayfa",
}
contents.push(yeniSayfa);


