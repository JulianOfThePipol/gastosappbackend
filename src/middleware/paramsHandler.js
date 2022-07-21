import  CategoryList  from "../models/CategoryList.js";


export default async function paramsHandler (req, res, next) {
    const regex = /\d\d\d\d-\d\d-\d\d/;
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

    if(req.params.maxValue<req.params.minValue){
        return res.status(400).json({msg: "Valor mínimo no puede ser mayor a valor máximo" , error:true})
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

    if (req.params.maxDate || req.params.minDate){
        if(!req.params.minDate && req.params.maxDate){
            req.params.minDate = "1900-01-01"
        }
        if(!req.params.maxDate && req.params.minDate){
            var hoy = new Date();
            hoy.setDate(hoy.getDate()+1) //Lo pongo el dia siguiente para incluir los gastos del presente dia
            var dd = String(hoy.getDate()).padStart(2, '0');
            var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //enero es 0
            var yyyy = hoy.getFullYear();
            hoy = `${yyyy}-${mm}-${dd}`
            req.params.maxDate = hoy
        }
        if(!regex.test(req.params.minDate)||!regex.test(req.params.maxDate)){
            return res.status(400).json({msg: "El formato para fechas debe ser yyyy-mm-dd" , error:true})
        }
    }

    if(req.params.categoryID){
        const { user } = req
        const categoryList = await CategoryList.findOne({userID: user._id})
        if (!categoryList){
        res.status(400).json({ msg: "Listado de categorias no encontrado" , error: true})
        }
        const categoryExists = categoryList.categories.findIndex(category => category._id.toString() === req.params.categoryID);
        if(categoryExists === -1){
            return res.status(400).json({msg: "Categoría no encontrada", error: true})
        }
    }


    next()
}