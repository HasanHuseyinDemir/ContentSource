content={
    render:async(item,to,key)=>{
        data=await content.dry.fetch(item);
        data=content.namer(data);
        let keys=content.rkg();
        data=`<div id=${key?key+"_":keys+"_"}>${data}</div>`;
        data=(data.replaceAll("$$",key?key:keys));
            data=(data.replaceAll("__",key?key+"_":keys+"_"))
            await test.script(data,to,item,key?key:"defaultPage");
            test.ren(data,to);
        set(to);
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
        replace:(data,key)=>{
            data=(data.replaceAll("__",key+"_"));
            data=(data.replaceAll("$$",key));
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
        }
    },
    scrlist:[],
    chars:"abcdefghijklmnoprstuvyz_".split("")
}
load={
    script:async(file,key)=>{
        data=await content.dry.fetchAndReplace(file,key);
        await eval(data);
        set();
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
    styles:(array,folder,key)=>{
        array.map((item)=>{
            load.style((folder?folder:"")+item,key,render);
        })
    }
}
test={
    ren:(str,item)=>{
        str=(str.replaceAll("{{","<span class='set' data='"));
        str=(str.replaceAll("}}","'> </span>"));
        document.querySelector(item).innerHTML=str;
        test.interp(str,item);
    },
    interp:(str,item,index)=>{
        const first = "{%";
        const last = "%}";
        let starter = str.search(first);
        let endPoint = str.search(last);
        let isStarter = starter>-1;
        let isEndPoint = endPoint>-1;
        let isPolated = content.dry.polated;
        if(isPolated(isStarter,isEndPoint)==false){
            let element = document.querySelector(item);
            element.innerHTML.length!=str?element.innerHTML=str:"";
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
                            eval(interp);
                        }       
            }
        }
    }
}

let set=(element)=>{
    if(element){
      document.body.querySelectorAll(element).forEach((item)=>{
            item.querySelectorAll(".set").forEach((items)=>{
                var data = items.getAttribute("data");
                var inv = items.getAttribute("invisible");
                var vis = items.getAttribute("visible");
                if(data){
                    items.innerHTML!=(eval(data).toString())?items.innerHTML=(eval(data).toString()):"";
                }
                inv?(eval(inv)?items.style.display="none":items.style.display=""):"";
                vis?(eval(vis)?items.style.display="":items.style.display="none"):"";
            })})
    }else{
    document.body.querySelectorAll(".set").forEach((item)=>{
            var data = item.getAttribute("data");
            var inv = item.getAttribute("invisible");
            var vis = item.getAttribute("visible");
            if(data){
                item.innerHTML!=(eval(data).toString())?item.innerHTML=(eval(data).toString()):"";
            }
            inv?(eval(inv)?item.style.display="none":item.style.display=""):"";
            vis?(eval(vis)?item.style.display="":item.style.display="none"):"";
    })}
};
