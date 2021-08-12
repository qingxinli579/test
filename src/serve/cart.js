import cart from './carticon.json'
export function cartjson(){
    var obj={}
    for(var m=0;m<cart.result.length;m++){
        if(!obj[cart.result[m].first_letter]){
            obj[cart.result[m].first_letter]=[]
        }
        var obj2={
            value:cart.result[m].brand_name,
            brand_logo:cart.result[m].brand_logo

        }
        obj[[cart.result[m].first_letter]].push(obj2)
    }
    var result=[]
    for(var i in obj){
        var tep={}
        tep.label=i
        tep.options=obj[i]
        result.push(tep)
    }
    return result;
}