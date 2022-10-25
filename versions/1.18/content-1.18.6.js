let __=0;
var props={};
var slot="";
var ___alphabet___="abcdefghijklmnoprstuvyz_".split("");
var scrlist=[];
var evalist=[];
_____rkg=()=>{
    let arr="";
    for(var i=0;i<=9;i++){
        arr=arr+___alphabet___[Math.floor(Math.random() * (24))]
    }
    return arr;
}
contents.map(async(item)=>{
        switch(item.type){
            case "page":{let source = await fetch(item.src);let data = await source.text();
            data=`<div id="${item.name}">${data}</div>`;
            data=(data.replaceAll("__",item.name+"_")); //SemiLocalScope
            await scriptTest(data,item.name,item.src,"default");
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

    content=async(item,key)=>{
        let source = await fetch(item);
        let data = await source.text();
        let convert=item;
        convert=convert.split("/");
        let latest=convert[convert.length-1];
        let pageName=await latest.replace(".html","");
        await eval(`
        window.${pageName}={
            type:"page",
            src:"${item}",
            name:"${pageName}",
        }
        `);
        await contents.push(eval(pageName));
            data=`<div id=${pageName}>${data}</div>`;
            if(key){
                data=(data.replaceAll("__",_____rkg()+"_"));
            }else{
                data=(data.replaceAll("__",pageName+"_"));
            }
            
            await scriptTest(data,pageName,item,"default");
            renTest(data,eval(pageName));
            eval(pageName).render=(()=>{
                let index = document.querySelectorAll(item.name);
                index.forEach((i,index)=>{
                    let element = document.querySelectorAll(pageName)[index];
                    element.innerHTML.length==0?element.innerHTML=item.data:"";
                })
            })
            val();
    };
    cRender=async(item,to,key)=>{
        let source = await fetch(item);
        let data = await source.text();
        let keys=_____rkg();
        data=`<div id=${key?key+"_":keys+"_"}>${data}</div>`;
            data=(data.replaceAll("__",key?key+"_":keys+"_"))
        await scriptTest(data,to,item,key?key:"default");
            renTest(data,to);
            set();
    };
    loadContents=(array,folder)=>{
            array.map((item)=>{
                content((folder?folder:"")+item);
            })
    }

    loadScript=async(file)=>{
        let valid=false;
        evalist.map((item)=>{
            if(item.toString()===file.toString()){
                valid=true;
            }
        })
        if(!valid){
            evalist.push(file);
            data=await fetch(file);
            script=await data.text();
            await eval(script);
            set();
        }
    };

    loadScripts=(array,folder)=>{
        array.map((item)=>{
            loadScript((folder?folder:"")+item);
        })
    }

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
            if(item.type=="page"||typeof item=="string"){
                if(typeof item=="string"){
                    document.querySelector(item).innerHTML=str;
                    interpTest(str,item)
                }else{
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
            if(item.type=="page"||typeof item=="string"){
                    if(str&&typeof item!=="string"){
                        let element = document.querySelectorAll(item.name)[index];
                        element.innerHTML.length!=str?element.innerHTML=str:"";
                        props={};
                        slot="";
                    }
                }
                if(typeof item=="string"){
                    let element = document.querySelector(item);
                    element.innerHTML.length!=str?element.innerHTML=str:"";
                } 
        }else{
        let interp = str.slice(starter+first.length,endPoint)
        let output =()=> {return eval(interp)};
        let clean = str.slice(0,starter)+output()+str.slice(endPoint+last.length);
        interpTest(clean,item,index)
    }
}
scriptTest=(str,element,file,key)=>{
    let valid=false;
    let arrays =[element,file,key];
    scrlist.map((item)=>{
        if(item.toString()===arrays.toString()){
            valid=true;
        }
    });
    if(!valid){
    scrlist.push(arrays);
    const first = "<script>";
    const last = "</script>";

    //ilk önce tarama işlemi

    //eğer eşleşirse çalıştırma işlemi
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
    if(isPolated(isStarter,isEndPoint)==true){
                    if(str){
                        let interp = str.slice(starter+first.length,endPoint);
                        eval(interp);
                    }       
        }
                
    }
};



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
