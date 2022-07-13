import { CategoryList } from "../models/index.js";

const getCategoryList = async (req, res) => { //Para pedir el listado de categorias
    const {user} = req //Este user viene dado por el checkAuth
    const categoryList = await CategoryList.findOne({userID: user._id}).select("categories -_id") //Buscamos la categoryList del usuario, y le sacamos la info que no nos sirve
    if (!categoryList){
        const error = new Error ("Listado de categorias no encontrado")
        res.status(400).json({ msg: error.msg })
    }
    res.json(categoryList)
}

const addCategory = async (req, res) => {
    const {user} = req
    const { categoryName, categoryColor } = req.body
    const categoryList = await CategoryList.findOne({userID: user._id}) //arrancamos con buscando la lista
    if (!categoryList){
        const error = new Error ("Listado de categorias no encontrado")
        res.status(400).json({ msg: error.msg })
    }
    const categoryExists = categoryList.categories.find(category => category.name === categoryName); //Nos aseguramos que el item no exista
    if(!categoryExists || categoryList.categories === []){
        categoryList.categories.push({name: categoryName, color: categoryColor}) //Agregamos la categoria a la lista
        try {
            await categoryList.save(); //Guardamos la nueva lista
            res.status(201).json({msg: "Categoria creada exitosamente"});
        } catch (error) {
            return res.status(409).json({msg: `Ocurrió un error: ${error}`})
        }
    } else {
        return res.status(400).json({msg:"La categoria ya existe"})
    }
}

const removeCategory = async (req, res) => {
    const {user} = req
    const { categoryName } = req.body
    const categoryList = await CategoryList.findOne({userID: user._id})
    if (!categoryList){
        const error = new Error ("Listado de categorias no encontrado")
        res.status(400).json({ msg: error.msg })
    }
    const categoryExists = categoryList.categories.find(category => category.name === categoryName); //Aca nos aseguramos que la categoria exista
    console.log(categoryExists) //sacar
    if(categoryExists){
        categoryList.categories = categoryList.categories.filter(category => category._id !== categoryExists._id); //Sacamos la categoria del listado
        try { 
            await categoryList.save(); //Guardamos el listado
            res.status(201).json({msg: "Categoria eliminada exitosamente"}); //Le puse un 201 en vez de un 204 para poder mandar un json de respuesta, personalmente prefiero ver que reciba algo
        } catch (error) {
            return res.status(409).json({msg: `Ocurrió un error: ${error}`})
        }
    } else {
        return res.status(400).json({msg:"La categoria no existe"})
    }
}

export { getCategoryList, addCategory, removeCategory }