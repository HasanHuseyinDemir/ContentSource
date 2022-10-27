props={};
content={
    render:(file,to,key)=>{
            let source=fetch(file);
            source.then((res)=>{return res.text()})
            .then((res)=>{
                let data = res;
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
            })
            .then((res)=>{
                //test.ren(data,to,key,file);
                res=(res.replaceAll("{{","<span class='set' data='"));
                res=(res.replaceAll("}}","'> </span>"));
                let indexe = document.querySelectorAll(to);
                let attr="";
                indexe.forEach((i,index)=>{
                    proplist=i.getAttributeNames();
                    proplist.map((items)=>{
                    items=="key"?attr=(i.getAttribute("key")).replaceAll("'","").replaceAll('"',""):"";
                    eval(`props.${items}=${i.getAttribute(items)}`);
                })
                let keys=()=>{
                let arr="";
                for(var i=0;i<=9;i++){
                    arr=arr+content.chars[Math.floor(Math.random() * (24))]
                }
                return arr;;
                }
                let specific=attr?attr:key?key:keys();
                res=(res.replaceAll('$$',specific));
                res=(res.replaceAll("__",specific+"_"));
                res=`<div id=${specific+"_"}>${res}</div>`;
                slot=document.querySelectorAll(to)[index].innerHTML;
                let valid=false;
                let arrays =[file,key];
                content.scrlist.map((item)=>{
                    if(item.toString()===arrays.toString()){
                        valid=true;
                    }
                });
                if(!valid){
                content.scrlist.push(arrays);
                let first = "<script>";
                let last = "</script>";
                let starter = res.search(first);
                let endPoint = res.search(last);
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
                                if(res){
                                    let interp = res.slice(starter+first.length,endPoint);
                                    eval(interp);
                                }       
                    }
                }
                
                first = "{%";
                last = "%}";
                let starter = res.search(first);
                let endPoint = res.search(last);
                let isStarter = starter>-1;
                let isEndPoint = endPoint>-1;
                if(isPolated(isStarter,isEndPoint)==false){
                    let element = document.querySelectorAll(item)[index];
                    element.innerHTML.length!=res?element.innerHTML=res:"";
                }else{
                    let interp = res.slice(starter+first.length,endPoint)
                    let output =()=> {return eval(interp)};
                    let clean = res.slice(0,starter)+output()+res.slice(endPoint+last.length);
                    test.interp(clean,item,index,key,file)
                }

                test.interp(res,to,index,specific,file);
                props={};
                slot="";
            });
    }
)
},
scrlist:[],
chars:"abcdefghijklmnoprstuvyz_".split(""),
}