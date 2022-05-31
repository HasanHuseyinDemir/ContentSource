let dataSet = {
    value:[],
    get:()=>{
        dataSet.value.forEach((value)=>{
            eval(`dataSet.${value}=window.${value}`)
        })
    },
    set:(condition)=>{
        dataSet.value.forEach((value)=>{
            if(eval(`dataSet.${value}`)!==eval(`window.${value}`)){      
                dataSet.get();
                condition==="atom"?set():val();
            }
        })
    }
}

setData=(arg,condition)=>{
    dataSet.set(condition);
}
