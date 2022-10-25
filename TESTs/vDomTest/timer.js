let date =()=> new Date();
let timerAtom ={
    name:"Timer",
    type:"atom",
    data:()=>{
        return `<span data="date().getHours()"></span> : <span data="date().getMinutes()"></span> : <span data="date().getSeconds()"></span>`
    }
}


let activeTimer=false;
let timer =()=>{
    if(activeTimer){
        setTimeout(()=>{set(),timer()},1000)
    }
};

toggleTimer=()=>{
    activeTimer=!activeTimer;
    timer();
}

contents.push(timerAtom);