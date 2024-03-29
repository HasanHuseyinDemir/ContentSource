let __=0;
var props={};
var slot="";
contents.map(async(item)=>{
        switch(item.type){
            case "page":{let source = await fetch(item.src);let data = await source.text();
            renTest(data,item);
            item.render=(()=>{
                let index = document.querySelectorAll(item.name);
                index.forEach((i,index)=>{
                    let element = document.querySelectorAll(item.name)[index];
                    element.innerHTML.length==0?element.innerHTML=item.data:"";
                })
            })
            }break;            
            case "atom":{
                item.render=()=>{
                    let index = document.querySelectorAll(item.name);
                    index.forEach((i,index)=>{
                        let element = document.querySelectorAll(item.name)[index];
                        element.innerHTML.length==0?element.innerHTML=item.data():"";
                    })
                    }
            }break;
        }
        __++
        if(__==contents.length){
            set();
            val();
            set();
        }
    })

renTest=(str,item)=>{
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
    if(isPolated(isStarter,isEndPoint)==false){
            if(item.type=="page"){
                item.data=str;
                let indexe = document.querySelectorAll(item.name);
                    indexe.forEach((i,index)=>{
                        proplist=i.getAttributeNames();
                        proplist.map((items)=>{
                            eval(`props.${items}=${i.getAttribute(items)}`);
                    })
                    slot=document.querySelectorAll(item.name)[index].innerHTML;
                    interpTest(item.data,item,index);
                    props={};
                
                })

            }

        }else{
        let interp = str.slice(starter+first.length,endPoint)
        let output =()=> {return `<c data='${interp}'></c>`};
        let clean = str.slice(0,starter)+output()+str.slice(endPoint+last.length);
        renTest(clean,item)
    }
};

interpTest=(str,item,index)=>{
    const first = "{%";
    const last = "%}";
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
    if(isPolated(isStarter,isEndPoint)==false){
            if(item.type=="page"){
                    if(str){
                        let element = document.querySelectorAll(item.name)[index];
                        element.innerHTML.length!=str?element.innerHTML=str:"";
                        props={};
                        slot="";
                    }
                }       
        }else{
        let interp = str.slice(starter+first.length,endPoint)
        let output =()=> {return eval(interp)};
        let clean = str.slice(0,starter)+output()+str.slice(endPoint+last.length);
        interpTest(clean,item,index)
    }
}

ctrl=()=>{
    document.body.querySelectorAll("*").forEach((item)=>{
    var data = item.getAttribute("data");
    var set = item.getAttribute("set");
    var array = item.getAttribute("array");
    var type = item.getAttribute("type");
    var query = item.getAttribute("if");
    var valid = item.getAttribute("true");
    var invalid = item.getAttribute("false");
    var inv = item.getAttribute("invisible");
    var vis = item.getAttribute("visible");
    var value = item.getAttribute("setValue");
    var content = "";
    if(data){
        item.innerHTML!=(eval(data).toString())?item.innerHTML=(eval(data).toString()):"";
    }
    //////////////////////////////////////////////////MAP

    if(array&&type){
        eval(array).forEach((el)=>{
            content+=`<${type}>${el}</${type}>`;
        })
        item.innerHTML!=content.toString()?item.innerHTML=(content.toString()):"";
    }
    
    ///////////////////////////////////////////////////IF ELSE
        if(query){
            if(eval(query)==true){
                if(valid){
                    item.innerHTML!=eval(valid).toString()?item.innerHTML=(eval(valid).toString()):"";
                }
            }else{
                if(invalid){
                    item.innerHTML!=eval(invalid).toString()?item.innerHTML=(eval(invalid).toString()):"";
                }
            }
        }
    ////////////////////////////////////////////////

    if(set&&array){
        content = eval(array).map((items,index)=>{
            return eval(data);
        }).join('');
        var filt = content.toString();
        item.innerHTML.toString()!=filt?item.innerHTML=filt:"";  
    }
    /////////////////////////////////////////////////
    inv?(eval(inv)?item.style.display="none":item.style.display=""):"";
    vis?(eval(vis)?item.style.display="":item.style.display="none"):"";
    ///////////////////////////////////
    value?(item.innerHTML.toString()!=eval(value)?item.value=eval(value):""):"";  
    ////////////////////////////////////
})};

let set=()=>{
    contents.map((el)=>{if(el.type=="atom"){el.render()}});
    ctrl();
}

val=()=>{
    contents.map((items)=>{
        items.render()
    });
    set();
}
