import { CategoryList, ExpenseList } from "../models/index.js";


const getExpenseList = async (req, res) => { //Para pedir el listado de categorias
    const {user} = req //Este user viene dado por el checkAuth
    const expenseList = await ExpenseList.findOne({userID: user._id}).select("expenses -_id") //Buscamos la expenseList del usuario, y le sacamos la info que no nos sirve
    if (!expenseList){
        res.status(400).json({ msg: "Listado de gastos no encontrado" , error:true})
    }
    res.json(expenseList)
}

const addExpense = async (req, res) => {
    const {user} = req
    const { expenseName, expenseValue, expenseDate, categoryName } = req.body
    const expenseList = await ExpenseList.findOne({userID: user._id}) //arrancamos buscando la lista

    if (!expenseList){
        res.status(400).json({ msg: "Listado de gastos no encontrado" , error:true})
    }

    const categoryList = await CategoryList.findOne ({ userID: user._id})

    if (!categoryList){
        res.status(400).json({ msg: "Listado de categorias no encontrado" , error:true })
    }

    const categoryExists = categoryList.categories.find(category => category.name === categoryName);
    console.log(categoryExists)
    if (!categoryExists) {
        res.status(400).json({ msg: "Categoría no encontrada", error:true})
    } else { 
    expenseList.expenses.push({name: expenseName, value: expenseValue, date: expenseDate, categoryID: categoryExists._id}) //Agregamos el gasto a la lista
    try {
        await expenseList.save(); //Guardamos la nueva lista
        res.status(201).json({msg: "Gasto creado exitosamente"});
    } catch (error) {
        return res.status(409).json({msg: `Ocurrió un error: ${error}` , error:true})
    }}

}

const removeExpense = async (req, res) => {
    const {user} = req
    const { expenseID } = req.body
    const expenseList = await ExpenseList.findOne({userID: user._id})
    if (!expenseList){
        res.status(400).json({ msg: "Listado de gastos no encontrado" , error:true})
    }
    const expenseExists = expenseList.expenses.findIndex(expense => expense._id.toString() === expenseID); //Aca nos aseguramos que el gasto exista, y extraemos su index
    if(expenseExists !== -1){
        console.log(expenseList.expenses.expenseExists)
        expenseList.expenses.splice(expenseExists, 1) //Sacamos la categoria del listado
        try { 
            await expenseList.save(); //Guardamos el listado
            res.status(201).json({msg: "Gasto eliminado exitosamente"}); //Le puse un 201 en vez de un 204 para poder mandar un json de respuesta, personalmente prefiero ver que reciba algo
        } catch (error) {
            return res.status(409).json({msg: `Ocurrió un error: ${error}` , error:true})
        }
    } else {
        return res.status(400).json({msg:"El gasto no existe" , error:true})
    }
}

const changeExpense = async (req, res) => {
    const { user } = req
    const { expenseID, newExpenseName, newExpenseValue, newCategory, newExpenseDate } = req.body
    const expenseList = await ExpenseList.findOne({userID: user._id})
    if (!expenseList){
        res.status(400).json({ msg: "Listado de gastos no encontrado" , error:true})
    }
    if(!newExpenseName && !newExpenseValue && !newCategory && !newExpenseDate) {
        return res.status(400).json({msg: "No hay cambios a realizar" , error:true})
    }
    const expenseExists = expenseList.expenses.findIndex(expense => expense._id.toString() === expenseID);
    if (expenseExists !== -1){

        if(newCategory){
            const categoryList = await CategoryList.findOne ({ userID: user._id});
            const categoryExists = categoryList.categories.find(category => category.name === newCategory);
            if (!categoryExists) {
                return res.status(400).json({msg: "La categoria no existe", error: true})
            } else {
                expenseList.expenses[expenseExists].categoryID = categoryExists._id
            }
        }
        if (newExpenseName){
            expenseList.expenses[expenseExists].name = newExpenseName
        }

        if (newExpenseDate){
            expenseList.expenses[expenseExists].date = newExpenseDate
        }

        if (newExpenseValue){
            expenseList.expenses[expenseExists].value = newExpenseValue
        } // Habria que refinar esta parte, está poco legible.

        try {
            await expenseList.save(); //Guardamos el listado
            res.status(201).json({msg: "Gasto modificado exitosamente"});
        } catch (error){
            return res.status(409).json({msg: `Ocurrió un error: ${error}` , error:true})
        }
    } else {
        return res.status(400).json({msg:"El gasto no existe" , error:true})
    }
}

const searchExpenseList = async (req, res) => { //Para pedir el listado de categorias
    const {user} = req //Este user viene dado por el checkAuth
    const { searchName } = req.params
    const expenseList = await ExpenseList.findOne({userID: user._id}).select("expenses -_id") //Buscamos la expenseList del usuario, y le sacamos la info que no nos sirve
    if (!expenseList){
        res.status(400).json({ msg: "Listado de gastos no encontrado" , error:true})
    }
    const searchedList = expenseList.expenses.filter(expense => expense.name.includes(searchName))
    if (searchedList){
        return res.status(200).json(searchedList)
    } else{
        return res.status(400).json({msg: "No hay ningun gasto que contenga ese nombre"})
    }
}


export {getExpenseList, addExpense, removeExpense, changeExpense, searchExpenseList}