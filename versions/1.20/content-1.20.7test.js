/*
*
* @License ContentJS
*
* Copyright (c) Hasan Hüseyin Demir.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/ 

let props={};


content={
    render:async(item,to,key)=>{
        data=await content.dry.fetch(item);
        data=content.namer(data);
        test.ren(data,to,key,item);
    },
    namer:(item)=>{
        let data = item;
        let last="/>";
        let first="<";
        let count=data.split(last).length-1;
        let counted =0;
        while(count>counted){
        let lastplac=data.search(last)-1;
        let i=0;
        let deval="";
        while(lastplac-i>=-1){
            if(data.charAt(lastplac-i)==first){
                deval=deval.split("").reverse().join("");//Yazılar Ters
                let name=deval.split(" ")[0];//İsim
                let props=deval.replace(name,"");//Geri Kalanı
                let completed=`<${name} ${props?props:""}></${name}>`;
                data=data.slice(0,lastplac-i)+completed+data.slice(lastplac+4,data.length);
                counted++;
                lastplac="";
                i=0;
                deval="";
            }else{
                deval=deval+data.charAt(lastplac-i);
            }
            i++;
        }
        }
        return data;
    },
    rkg:()=>{
        let arr="";
        for(var i=0;i<=9;i++){
            arr=arr+content.chars[Math.floor(Math.random() * (24))]
        }
        return arr;
    },
    dry:{
        fetch:async (file)=>{
            let source=await fetch(file);
            var data=await source.text();
            return data;
        },
        replace:async(data,key)=>{
            data=await (data.replaceAll("__",key+"_"));
            data=await (data.replaceAll("$$",key));
            return data;
        },
        fetchAndReplace:async(file,key)=>{
            data=await content.dry.fetch(file);
            data=await content.dry.replace(data,key);
            return data;
        },
        polated:(start,end)=>{
            if(start==true&&end==true){
                return true;
            }else{
                return false;
            }
        },
        props:{}
    },
    watch:[],
    scrlist:[],
    chars:"abcdefghijklmnoprstuxvyz_".split(""),

}
load={
    script:async(file,key)=>{
        data=await content.dry.fetchAndReplace(file,key);
        await eval(data);
        //set();
    },
    scripts:(array,folder,key)=>{
        array.map((item)=>{
            load.script((folder?folder:"")+item,key);
        })
    },
    style:async(file,key,render)=>{
        data=await content.dry.fetchAndReplace(file,key);
        data=`<style id=${key}>${data}</style>`;
        document.querySelector(render?render:"body").innerHTML+=data;
    },
    styles:(array,folder,key,render)=>{
        array.map((item)=>{
            load.style((folder?folder:"")+item,key,render);
        })
    }
}
test={
    ren:(str,to,key,file)=>{
        let indexe = document.querySelectorAll(to);
        let attr="";
        indexe.forEach((i,index)=>{
            proplist=i.getAttributeNames();
            proplist.map((items)=>{
            items=="key"?attr=(i.getAttribute("key")).replaceAll("'","").replaceAll('"',""):"";
            eval(`props.${items}=${i.getAttribute(items)}`);
        })
        let keys=content.rkg();
        let specific=attr?attr:key?key:keys;
        str=(str.replaceAll('$$',specific));
        str=(str.replaceAll("__",specific+"_"));
        if(to.includes("#")||to.includes(".")){
        }else{
            str=`<div id=${specific+"_"}>${str}</div>`;
        }
        slot=document.querySelectorAll(to)[index].textContent;
        test.interp(str,to,index,specific,file);

        props={};
        slot="";
    })
    },
    interp:(str,item,index,key,file)=>{
        const first = "{%";
        const last = "%}";
        let starter = str.search(first);
        let endPoint = str.search(last);
        let isStarter = starter>-1;
        let isEndPoint = endPoint>-1;
        let isPolated = content.dry.polated;
        if(isPolated(isStarter,isEndPoint)==false){
            let element = document.querySelectorAll(item)[index];
            element.innerHTML.length!=str.length?element.innerHTML=str:"";
            //str ile replace edilmesi gerekiyor asıl {{ }}
            //script ve defer içeriğinden ayrılıp ayriyeten teste tabi tutulması gerekir
            //sonrasında elemente dönüştürülüp appendchild edilir.
            //ilk önce unmount içinde yazanlar okunulur.
            element.innerHTML=element.innerHTML.replaceAll("{{","<span class='set' data='").replaceAll("}}","'> </span>");
            test.script(str,file,key,element);
        }else{
            let interp = str.slice(starter+first.length,endPoint)
            let output =()=> {return eval(interp)};
            let result=output();
            let clean = str.slice(0,starter)+(result.length?result:"")+str.slice(endPoint+last.length);
            test.interp(clean,item,index,key,file)
        }
    },
    script:async(str,file,key,element)=>{

        let valid=false;
        let arrays =[file,key];
        content.scrlist.map((item)=>{
            if(item.toString()===arrays.toString()){
                valid=true;
            }
        });
        if(!valid){
        content.scrlist.push(arrays);
        const first = "<script>";
        const last = "</script>";
        let starter = str.search(first);
        let endPoint = str.search(last);
        let isStarter = starter>-1;
        let isEndPoint = endPoint>-1;
        let isPolated = content.dry.polated;
        if(isPolated(isStarter,isEndPoint)==true){
                        if(str){
                            let interp = str.slice(starter+first.length,endPoint);
                            await eval(interp);
            }
        }
    }

    test.customscript("defer",str,element);
    },
customscript:async(condition,str,element)=>{
    let valid=false;
    let arr=document.querySelectorAll(condition)
    arr.forEach((item)=>{
        item.style.display="none";
    });
    if(!valid){
    const first = `<${condition}>`;
    const last = `</${condition}>`;
    let starter = str.search(first);
    let endPoint = str.search(last);
    let isStarter = starter>-1;
    let isEndPoint = endPoint>-1;
    let isPolated = content.dry.polated;
    if(isPolated(isStarter,isEndPoint)==true){
                    if(str){
                        let interp = str.slice(starter+first.length,endPoint);
                        await eval(interp);
        }
    };

}

set();
}
}

set=(element)=>{
    if(element){
      document.body.querySelectorAll(element).forEach((contentelem)=>{
            contentelem.querySelectorAll(".set").forEach((contentelems)=>{
                var data = contentelems.getAttribute("data");
                var inv = contentelems.getAttribute("invisible");
                var vis = contentelems.getAttribute("visible");
                if(data){
                    contentelems.textContent!=(eval(data).toString())?contentelems.innerHTML=(eval(data).toString()):"";
                }
                inv?(eval(inv)?contentelems.style.display="none":contentelems.style.display=""):"";
                vis?(eval(vis)?contentelems.style.display="":contentelems.style.display="none"):"";
            })})
    }else{
    document.body.querySelectorAll(".set").forEach((contentelem)=>{
            var data = contentelem.getAttribute("data");
            var inv = contentelem.getAttribute("invisible");
            var vis = contentelem.getAttribute("visible");
            if(data){
                contentelem.textContent!=(eval(data).toString())?contentelem.innerHTML=(eval(data).toString()):"";
            }
            inv?(eval(inv)?contentelem.style.display="none":contentelem.style.display=""):"";
            vis?(eval(vis)?contentelem.style.display="":contentelem.style.display="none"):"";
    })}
    w();
};


let dataSet = {
    value:[],
    get:()=>{
        dataSet.value.forEach((value)=>{
            eval(`dataSet.${value}=window.${value}`)
        })
    },
    set:()=>{
        dataSet.value.forEach((value)=>{
            if(eval(`dataSet.${value}`)!==eval(`${value}`)){      
                dataSet.get();
                console.log("Değişim\n"+"value="+eval(value))
                set();
                return
            }
        })
    }
}

class watch{
    constructor(value,func){
        this.watching=value;
        this.value=value.map((item)=>{return eval(item)})
        this.func=func;
    }
    get(){
        this.value = this.watching.map((item)=>{return eval(item)})
    }
    set (){
        var temp = this.watching.map((item)=>{return eval(item)})
        if(temp.join("")!==this.value.join("")){      
            this.get();
            this.func();
            set();
        }
    }
}

w=()=>{
    content.watch.forEach((item)=>{
        item.set();
    });
    dataSet.set();
}
