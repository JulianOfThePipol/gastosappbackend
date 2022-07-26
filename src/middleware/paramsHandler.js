import  CategoryList  from "../models/CategoryList.js";


export default async function queryHandler (req, res, next) {
    const regex = /\d\d\d\d-\d\d-\d\d/;
    if(!req.query.page){
        req.query.page = 1
    }
    if(!req.query.limit){
        req.query.limit = 5
    }
    if(!req.query.sortBy){
        req.query.sortBy = "name"
    }
    if(req.query.sortBy !== "name" && req.query.sortBy !== 'value' && req.query.sortBy !== "date"){
        return res.status(400).json({msg: "Valor incorrecto de sortBy" , error:true})
    }
    if(isNaN(parseInt(req.query.page))  || isNaN(parseInt(req.query.limit))){
        return res.status(400).json({msg: "La página y el límite deben ser números" , error:true})
    }
    if (!req.query.desc){
        req.query.desc="1"
    }
    if(req.query.desc !== "1" && req.query.desc !=="-1"){
        return res.status(400).json({msg: "El valor permitido para desc es 1 y -1" , error:true})
    }
    
    if(req.query.minValue || req.query.minValue===0 || req.query.maxValue){
        if(!req.query.minValue && req.query.minValue !==0 ){
            req.query.minValue = 0
        }
        if(isNaN(parseInt(req.query.minValue))  || ((isNaN(parseInt(req.query.maxValue) || (!req.query.maxValue)) ))){
            return res.status(400).json({msg: "El valor mínimo o máximo debe ser un número" , error:true})
    }} /// Probablemente alguien me putee por poner tantos ifs.
    if(parseInt(req.query.maxValue)<parseInt(req.query.minValue)){
        return res.status(400).json({msg: "Valor mínimo no puede ser mayor a valor máximo" , error:true})
    }

    if (req.query.maxDate || req.query.minDate){
        if(!req.query.minDate && req.query.maxDate){
            req.query.minDate = "1900-01-01"
        }
        if(!req.query.maxDate && req.query.minDate){
            var hoy = new Date();
            hoy.setDate(hoy.getDate()+1) //Lo pongo el dia siguiente para incluir los gastos del presente dia
            var dd = String(hoy.getDate()).padStart(2, '0');
            var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //enero es 0
            var yyyy = hoy.getFullYear();
            hoy = `${yyyy}-${mm}-${dd}`
            req.query.maxDate = hoy
        }
        if(!regex.test(req.query.minDate)||!regex.test(req.query.maxDate)){
            return res.status(400).json({msg: "El formato para fechas debe ser yyyy-mm-dd" , error:true})
        }
    }

    if(req.query.categoryID){
        const { user } = req
        const categoryList = await CategoryList.findOne({userID: user._id})
        if (!categoryList){
        res.status(400).json({ msg: "Listado de categorias no encontrado" , error: true})
        }
        const categoryExists = categoryList.categories.findIndex(category => category._id.toString() === req.query.categoryID);
        if(categoryExists === -1){
            return res.status(400).json({msg: "Categoría no encontrada", error: true})
        }
    }

    next()
}