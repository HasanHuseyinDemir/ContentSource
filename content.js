pages.map(async(item)=>{
    let source = await fetch(item.src);
    let data = await source.text();
    item.data=data;
    item.render=async()=>{
        var element = document.querySelector(item.component).shadowRoot.firstElementChild;
        let filter = removeTemplateTag(data);
        renderTest(filter,element);
    }
    const componentName= item.component;
    interpolationTest(item.data,componentName);
});

createContent=(name,data)=>{
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

interpolationTest=(str,component)=>{
    //Test
    //console.log("TEST:\n"+str);

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
        createContent(component,str);
    }else{
        let interp = str.slice(starter+first.length,endPoint)
        let output =()=> {return eval(interp)};
        let clean = str.slice(0,starter)+output()+str.slice(endPoint+last.length);
    interpolationTest(clean,component)
    }
};

//Artıklar
removeTemplateTag=(data)=>{
    const removeStart = data.replace("<template>","");
    const removeEnd = removeStart.replace("</template>","");
    return removeEnd
}


renderTest=(str,element)=>{
    //Test
    //console.log("TEST:\n"+str);

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
    }else{
        let interp = str.slice(starter+first.length,endPoint)
        let output =()=> {return eval(interp)};
        let clean = str.slice(0,starter)+output()+str.slice(endPoint+last.length);
        renderTest(clean,element)
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
}