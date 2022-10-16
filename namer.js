cNamer=(item)=>{
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
}
