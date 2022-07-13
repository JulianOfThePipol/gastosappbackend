import { CategoryList } from "../models/index.js";

const getCategoryList = async (req, res) => {
    const {user} = req
    const categoryList = await CategoryList.findOne({userID: user._id}).select("categories -_id")
    if (!categoryList){
        const error = new Error ("Listado de categorias no encontrado")
        res.status(400).json({ msg: error.msg })
    }
    res.json(categoryList)
}

const addCategory = async (req, res) => {
    const {user} = req
    const { categoryName, categoryColor } = req.body
    const categoryList = await CategoryList.findOne({userID: user._id})
    if (!categoryList){
        const error = new Error ("Listado de categorias no encontrado")
        res.status(400).json({ msg: error.msg })
    }
    const categoryExists = categoryList.categories.find(category => category.name === categoryName);
    if(!categoryExists || categoryList.categories === []){
        categoryList.categories.push({name: categoryName, color: categoryColor})
        try {
            await categoryList.save();
            res.status(201).json({msg: "Categoria creada exitosamente"});
        } catch (error) {
            return res.status(409).json({msg: `Ocurrió un error: ${error}`})
        }
    } else {
        return res.status(400).json({msg:"La categoria ya existe"})
    }
}

export { getCategoryList, addCategory }