import { CategoryList } from "../models/index.js";

const getCategoryList = async (req, res) => {
    const {user} = req
    const categoryList = await CategoryList.findOne({userID: user._id})
    if (!categoryList){
        const error = new Error ("Listado de categorias no encontrado")
        res.status(400).json({ msg: error.msg })
    }
    res.json(categoryList)
}

export { getCategoryList }