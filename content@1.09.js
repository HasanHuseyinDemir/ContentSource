createAtom=(names,page)=>{
    customElements.define(names,class extends HTMLElement {
        connectedCallback() {
          this.innerHTML = page;
        }
    });
}

contents.map(async(item)=>{
        switch(item.type){
            //SAYFA
            case "page":{let source = await fetch(item.src);let data = await source.text();
            item.data=data;
            item.render=async()=>{
                let index = document.querySelectorAll(item.name);
                let filter = removeTemplateTag(data);
                index.forEach((i,index)=>{
                    let element = document.querySelectorAll(item.name)[index];
                    renderTest(filter,element);
                })
                

            }
            const componentName= item.name;
            interpolationTest(item.data,componentName)};break;
    
            //ATOM
            case "atom":{
            createAtom(item.name,item.data()),
            item.render=()=>{
                document.querySelectorAll(item.name).forEach(page=>page.innerHTML=item.data());
            }};break;
    
            //COMPOSITION
            case "composition":{
                let source = await fetch(item.src);
                let data = await source.text();
                item.data=data;
                item.render=async()=>{
                    let element = document.querySelector(item.name).shadowRoot.firstElementChild;
                    let filter = removeTemplateTag(data);
                    renderTest(filter,element,"composition");
                }
                const componentName= item.name;
                interpolationTest(item.data,componentName,"composition");
            }
        }
    })

//Dışarıdan çağırılan template dosyanın içeriğini shadow dom olarak hazırlar(slotlar dışında dinamik bir sayfa içermez!) 
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

createContentv2=(name,data)=>{
    customElements.define(name,class extends HTMLElement {
        connectedCallback() {
          this.innerHTML = data;
        }
    });
};

interpolationTest=(str,component,condition)=>{
    //Semboller
    const first = "{{";
    const last = "}}";

    //Konum Araçları
    let starter = str.search(first);
    let endPoint = str.search(last);

    //Doğrulama Araçları
    let isStarter = starter>-1;// { sembol varsa true eğer yoksa -1 dönecektir!
    let isEndPoint = endPoint>-1;// }sembol varsa true
    
    //Eğer sayfada "{" ve "}" var ise true değeri döndürür!
    //Her ikisi yoksa false değeri dönecektir!
    let isPolated = (start,end )=>{
        if(start==true&&end==true){
            return true
        }else{
            return false;
        }
    }
    if(isPolated(isStarter,isEndPoint)==false){
        switch(condition){
            case "composition":composition(component,str);break;
            default:createContentv2(component,str);break;
        }
    }else{
        let interp = str.slice(starter+first.length,endPoint)
        let output =()=> {return eval(interp)};
        let clean = str.slice(0,starter)+output()+str.slice(endPoint+last.length);
    interpolationTest(clean,component,condition)
    }
};

//Artıklar
removeTemplateTag=(data)=>{
    const removeStart = data.replace("<template>","");
    const removeEnd = removeStart.replace("</template>","");
    return removeEnd
}


renderTest=(str,element,condition)=>{
    //Semboller
    const first = "{{";
    const last = "}}";

    //Konum Araçları
    let starter = str.search(first);
    let endPoint = str.search(last);

    //Doğrulama Araçları
    let isStarter = starter>-1;// { sembol varsa true eğer yoksa -1 dönecektir!
    let isEndPoint = endPoint>-1;// }sembol varsa true
    
    //Eğer sayfada "{" ve "}" var ise true değeri döndürür!
    //Her ikisi yoksa false değeri dönecektir!
    let isPolated = (start,end )=>{
        if(start==true&&end==true){
            return true
        }else{
            return false;
        }
    }
    if(isPolated(isStarter,isEndPoint)==false){
        element.innerHTML=str;
        //set();
    }else{
        let interp = str.slice(starter+first.length,endPoint)
        let output =()=> {return eval(interp)};
        let clean = str.slice(0,starter)+output()+str.slice(endPoint+last.length);
        renderTest(clean,element,condition)
    }
};

setVal=(arg,variable,value)=>{
    if(value==undefined){
        return eval(`${arg}.value.${variable}`);
    }
    if(typeof value==="string"){
        const condition = `${arg}.value.${variable}="`+value+`"`;
        eval(condition);
    }else if(typeof value=="number"){
        const condition= `${arg}.value.${variable}=${value}`;
        eval(condition);
    }else if(typeof value=="object"){
        const condition= `${arg}.value.${variable}=${value}`;
    }
    eval(`${arg}.render()`)
    set();//Atom günceller
}

gVal=(arg,variable,value)=>{

if(typeof variable=="string"){
    if(value==undefined){
        return eval(`${variable}`);
    }else if(typeof value=="number"||typeof value=="object"){
        const condition=`${variable}=${value}`;
        eval(condition);
    }else if(typeof value==="string"){
        const condition = `${variable}="`+value+`"`;
        eval(condition);
    }
}
    eval(`${arg}.render()`);
    set();//Atom günceller
}

val=()=>{
    contents.map((el)=>el.render());
}

let set=()=>{
    contents.map((el)=>{if(el.type=="atom"){el.render()}});
}

