let __=0;
var props={};
var slot="";
var ___alphabet___="abcdefghijklmnoprstuvyz_".split("");
var scrlist=[];

content={
    render:async(item,to,key)=>{
        let source = await fetch(item);
        let data = await source.text();
        data=content.namer(data);
        let keys=content.randomkeygenerator();
        data=`<div id=${key?key+"_":keys+"_"}>${data}</div>`;
        data=(data.replaceAll("$$",key?key:keys));
            data=(data.replaceAll("__",key?key+"_":keys+"_"))
            await test.script(data,to,item,key?key:"defaultPage");
            test.ren(data,to);
            set();
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
                let completed=`<${name}${props?" "+props:""}></${name}>`;
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
    randomkeygenerator:()=>{
        let arr="";
        for(var i=0;i<=9;i++){
            arr=arr+___alphabet___[Math.floor(Math.random() * (24))]
        }
        return arr;
    }
}
load={
    script:async(file,key)=>{
        let data=await fetch(file);
        let script=await data.text();
        script=(script.replaceAll("__",key+"_"));
        script=(script.replaceAll("$$",key));
        await eval(script);
        set();
    },
    scripts:(array,folder,key)=>{
        array.map((item)=>{
            load.script((folder?folder:"")+item,key);
        })
    },
    style:async(file,key,render)=>{
        let data=await fetch(file);
        let css=await data.text();
        css=(css.replaceAll("__",key+"_"));
        css=(css.replaceAll("$$",key));
        css=`<style id=${key}>${css}</style>`;
        document.querySelector(render?render:"body").innerHTML+=css;
    },
    styles:(array,folder,key)=>{
        array.map((item)=>{
            load.style((folder?folder:"")+item,key,render);
        })
    }
}
test={
    ren:(str,item)=>{
        str=(str.replaceAll("{{","<c data='"));
        str=(str.replaceAll("}}","'> </c>"));
                    if(typeof item=="string"){
                        document.querySelector(item).innerHTML=str;
                        test.interp(str,item);
                    }else{
                        item.data=str;
                        let indexe = document.querySelectorAll(item.name);
                            indexe.forEach((i,index)=>{
                                proplist=i.getAttributeNames();
                                proplist.map((items)=>{
                                    eval(`props.${items}=${i.getAttribute(items)}`);
                            })
                            slot=document.querySelectorAll(item.name)[index].innerHTML;
                            test.interp(item.data,item,index);
                            props={};
                        })
                    }
    },
    interp:(str,item,index)=>{
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
            test.interp(clean,item,index)
        }
    },
    script:(str,element,file,key)=>{
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
    }
}

ctrl=()=>{
    document.body.querySelectorAll("*").forEach((item)=>{
    var data = item.getAttribute("data");
    var inv = item.getAttribute("invisible");
    var vis = item.getAttribute("visible");
    if(data){
        item.innerHTML!=(eval(data).toString())?item.innerHTML=(eval(data).toString()):"";
    }
    inv?(eval(inv)?item.style.display="none":item.style.display=""):"";
    vis?(eval(vis)?item.style.display="":item.style.display="none"):"";
})};

let set=()=>{
    ctrl();
}