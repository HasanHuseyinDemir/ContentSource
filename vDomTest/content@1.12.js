createComponent=(name,data)=>{
    customElements.define(name,class extends HTMLElement {
        connectedCallback() {
          this.innerHTML = data;
        }
    });
};

contents.map(async(item)=>{
    item.prev="";
    item.alt=item.name.toLowerCase();
        switch(item.type){
            //SAYFA
            case "page":{let source = await fetch(item.src);let data = await source.text();
            item.data=data;
            renderTest(data,item);
            item.render=(()=>{
                renderTest(data,item);
            })}break;
            case "static-page":{let source = await fetch(item.src);let data = await source.text();
                if(item.test==true){
                    renderTest(data,item,"static-page");
                }else{
                    createComponent(item.alt,data);
                }
            };break;
            case "static-atom":createComponent(item.name,item.data());break;
            case "atom":{
                    createComponent(item.alt,item.data()),
                    item.prev=item.data();
                    item.render=()=>{
                        var now =()=> item.data();
                        if(item.prev!==now()){
                            document.querySelectorAll(item.name).forEach(page=>page.innerHTML=item.data());
                            item.prev=now();
                        }
                    }
            }break;
            //COMPOSITION
            case "composition":{
                let source = await fetch(item.src);
                let data = await source.text();
                item.data=data;
                item.render=async()=>{
                    let filter = removeTemplateTag(data);
                    renderTest(filter,item,"test-composition");
                }
                renderTest(item.data,item,"composition");
            }break;
            case "static-composition":{
                let source = await fetch(item.src);
                let data = await source.text();
                if(item.test){
                    renderTest(data,item,"static-composition");
                }else{
                    composition(item.alt,data)
                }
            }break;
        }})

removeTemplateTag=(data)=>{
        const removeStart = data.replace("<template>","");
        const removeEnd = removeStart.replace("</template>","");
        return removeEnd
}

composition=(name,data)=>{
    let x = document.createElement("div");
    x.innerHTML=data;
    customElements.define(name,
    class extends HTMLElement {
    constructor() {
    super();
    let template = x.firstElementChild.content;
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.cloneNode(true));
}})};

renderTest=(str,item,condition)=>{
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
        switch(condition){
            case "composition":composition(item.alt,str);break;//init
            case "static-page":createComponent(item.alt,str);break;
        }
        if(item.type=="static-page"||item.type=="static-atom"||item.type=="static-composition"){
        }else{
            if(item.prev==""){//INIT!
            item.prev=str;
            if(item.type=="page"){
                createComponent(item.alt,str);
            }
            }
            if(item.prev!==str){//Diff
            let index = document.querySelectorAll(item.alt);
            index.forEach((i,index)=>{
                if(condition=="test-composition"){

                    var elements = document.querySelector(item.alt).shadowRoot;
                    elements.innerHTML=str;

                }else{
                let element = document.querySelectorAll(item.alt)[index];
                element.innerHTML=str;
                }
                item.prev=str;
            })
            
        }
        control()
    }
        }else{
        let interp = str.slice(starter+first.length,endPoint)
        let output =()=> {return eval(interp)};
        let clean = str.slice(0,starter)+output()+str.slice(endPoint+last.length);
        renderTest(clean,item,condition)
    }
};

val=()=>{
    contents.map((el)=>{if(el.type!=="static-page"&&el.type!=="static-atom"&&el.type!=="static-composition"&&el.type!=="text"){
        el.render()}
    });
    control()
}

gVal=(name)=>{
    contents.map((item)=>{
        if(item.name.toLowerCase()===name.toLowerCase()){
            item.render();
        }
    })
    control()
}

let set=()=>{
    contents.map((el)=>{if(el.type=="atom"){el.render()}});
    control();
}

control=async()=>{
    invisiblecontrol();
    datacontrol();
    mapcontrol();
    ifcontrol();
    patterncontrol();
}


//<data>
datacontrol=()=>{
    document.querySelectorAll("*").forEach((item)=>{
    var data = item.getAttribute("data");
    if(data){
        item.innerHTML!=(eval(data).toString())?item.innerHTML=(eval(data).toString()):"";
    }
})};

//<list>
mapcontrol=()=>{
    document.querySelectorAll("map").forEach((item)=>{
    var data = item.getAttribute("array");
    var type = item.getAttribute("type");
    var content = "";
    eval(data).forEach((el)=>{
        content+=`<${type}>${el}</${type}>`;
    })
    item.innerHTML!=content.toString()?item.innerHTML=(content.toString()):"";
    })
}

ifcontrol=()=>{
    document.querySelectorAll("if").forEach((item)=>{
    var query = item.getAttribute("?");

    var valid = item.getAttribute("true");
    var invalid = item.getAttribute("false");
    if(eval(query)==true){


        if(valid){
            item.innerHTML!=eval(valid).toString()?item.innerHTML=(eval(valid).toString()):"";
        }

    }else{
        if(invalid){
            item.innerHTML!=eval(invalid).toString()?item.innerHTML=(eval(invalid).toString()):"";
        }
    }
    })
}

patterncontrol=()=>{
    document.querySelectorAll("pattern").forEach((item)=>{
    var data = item.getAttribute("set");
    var array = item.getAttribute("array");
    var content;
    content = eval(array).map((items,index)=>{
        return eval(data);
    }).join("");
    item.innerHTML.toString()!=content.toString()?item.innerHTML=content.toString():"";  
    })
}

invisiblecontrol=()=>{
    document.querySelectorAll("*").forEach((item)=>{
        var inv = item.getAttribute("invisible");
        var vis = item.getAttribute("visible");
        inv?(eval(inv)?item.style.display="none":item.style.display=""):"";
        vis?(eval(vis)?item.style.display="":item.style.display="none"):"";
    })
}