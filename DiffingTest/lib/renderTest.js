window.renderTest=(str,item,condition)=>{
    const first = "{{";
    const last = "}}";
    let starter = str.search(first);
    let endPoint = str.search(last);
    let isStarter = starter>-1;
    let isEndPoint = endPoint>-1;
    let isPolated = (start,end )=>{
        if(start==true&&end==true){
            return true
        }else{
            return false;
        }
    }
    //////////////////////////////////////////////////////////////////////
    if(isPolated(isStarter,isEndPoint)==false){
        if(item.prev==""){//INIT!
            item.prev=str;
            let index = document.querySelectorAll(item.alt);
            index.forEach((i,index)=>{
                let element = document.querySelectorAll(item.alt)[index];
                element.innerHTML=str;
            });
        }
        if(item.prev!==str){//Diff
            let index = document.querySelectorAll(item.alt);
            console.log(item.name+" Değiştirildi");
            index.forEach((i,index)=>{
                let element = document.querySelectorAll(item.alt)[index];
                element.innerHTML=str;
            })
            item.prev=str;
        }
    ////////////////////////////////////////////////////////////////////

    }else{
        let interp = str.slice(starter+first.length,endPoint)
        let output =()=> {return eval(interp)};
        let clean = str.slice(0,starter)+output()+str.slice(endPoint+last.length);
        renderTest(clean,item,condition)
    }
};
