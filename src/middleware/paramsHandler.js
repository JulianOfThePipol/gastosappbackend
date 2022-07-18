

export default async function paramsHandler (req, res, next) {
    if(!req.params.page){
        req.params.page = 1
    }
    if(!req.params.limit){
        req.params.limit = 5
    }
    if(!req.params.sortBy){
        req.params.sortBy = "name"
    }
    if(req.params.sortBy !== "name" && req.params.sortBy !== 'value' && req.params.sortBy !== "date"){
        return res.status(400).json({msg: "Valor incorrecto de sortBy" , error:true})
    }
    if(isNaN(parseInt(req.params.page))  || isNaN(parseInt(req.params.limit))){
        return res.status(400).json({msg: "La página y el límite deben ser números" , error:true})
    }
    if (!req.params.desc){
        req.params.desc="1"
    }
    if(req.params.desc !== "1" && req.params.desc !=="-1"){
        return res.status(400).json({msg: "El valor permitido para desc es 1 y -1" , error:true})
    }
    if(!req.params.minValue){
        req.params.minValue = 0
    }
    if(!req.params.maxValue){
        req.params.maxValue = req.params.minValue
    }
    if(isNaN(parseInt(req.params.minValue))  || isNaN(parseInt(req.params.maxValue))){
        return res.status(400).json({msg: "El valor mínimo o máximo debe ser un número" , error:true})
    } /// Probablemente alguien me putee por poner tantos ifs.
    next()
}