contents.map(async(item)=>{
        switch(item.type){
            //SAYFA
            case "page":{let source = await fetch(item.src);let data = await source.text();
            item.data=data;
            item.render=async()=>{
                let index = document.querySelectorAll(item.name);
                index.forEach((i,index)=>{
                    let element = document.querySelectorAll(item.name)[index];
                    renderTest(filter,element);
                })
            }
}}})