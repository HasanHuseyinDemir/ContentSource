export * from "./lib/renderTest.js";

contents.map(async(item)=>{
        switch(item.type){
            //SAYFA
            case "page":{let source = await fetch(item.src);let data = await source.text();
            
            item.data=data;
            item.prev="";
            item.alt=item.name.toLowerCase();
            //contents.alias.push(item.alt);
            renderTest(data,item);
            item.render=(()=>{
                renderTest(data,item);
            })
}}})

window.val=()=>{
    contents.map((el)=>{if(el.type!=="static-page"&&el.type!=="static-atom"&&el.type!=="static-composition"&&el.type!=="text"){
        el.render()}
    });
}