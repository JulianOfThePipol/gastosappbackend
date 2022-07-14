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
    expenseList.expenses.push({name: expenseName, value: expenseValue, date: expenseDate, categoryID: category._id}) //Agregamos el gasto a la lista
    try {
        await expenseList.save(); //Guardamos la nueva lista
        res.status(201).json({msg: "Gasto creado exitosamente"});
    } catch (error) {
        return res.status(409).json({msg: `Ocurrió un error: ${error}` , error:true})
    }}

}

const removeExpense = async (req, res) => {
    const {user} = req
    const { expenseName } = req.body
    const expenseList = await ExpenseList.findOne({userID: user._id})
    if (!expenseList){
        res.status(400).json({ msg: "Listado de categorias no encontrado" , error:true})
    }
    const expenseExists = expenseList.expenses.findIndex(expense => expense.name === expenseName); //Aca nos aseguramos que la categoria exista, y extraemos su index
    console.log(expenseExists) //sacar
    if(expenseExists !== -1){
        console.log(expenseList.expenses.expenseExists)
        expenseList.expenses.splice(expenseExists, 1) //Sacamos la categoria del listado
        try { 
            await expenseList.save(); //Guardamos el listado
            res.status(201).json({msg: "Categoria eliminada exitosamente"}); //Le puse un 201 en vez de un 204 para poder mandar un json de respuesta, personalmente prefiero ver que reciba algo
        } catch (error) {
            return res.status(409).json({msg: `Ocurrió un error: ${error}` , error:true})
        }
    } else {
        return res.status(400).json({msg:"La categoria no existe" , error:true})
    }
}

const changeExpense = async (req, res) => {
    const { user } = req
    const { expenseName, newExpenseName, newExpenseColor } = req.body
    const expenseList = await ExpenseList.findOne({userID: user._id})
    if (!expenseList){
        res.status(400).json({ msg: "Listado de categorias no encontrado" , error:true})
    }
    if(!newExpenseName && !newExpenseColor) {
        return res.status(400).json({msg: "No hay cambios a realizar" , error:true})
    }
    const expenseExists = expenseList.expenses.findIndex(expense => expense.name === expenseName);
    if (expenseExists !== -1){
        if(expenseList.expenses[expenseExists].name === newExpenseName && 
            expenseList.expenses[expenseExists].color === newExpenseColor) {
                return res.status(400).json({msg: "No hay cambios" , error:true})
        }

        if (newExpenseName && expenseName !== newExpenseName){
            expenseList.expenses[expenseExists].name = newExpenseName
        }

        if (newExpenseColor && expenseList.expenses[expenseExists].color !== newExpenseColor){
            expenseList.expenses[expenseExists].color = newExpenseColor
        } // Habria que refinar esta parte, está poco legible.

        try {
            await expenseList.save(); //Guardamos el listado
            res.status(201).json({msg: "Categoria modificada exitosamente"});
        } catch (error){
            return res.status(409).json({msg: `Ocurrió un error: ${error}` , error:true})
        }
    } else {
        return res.status(400).json({msg:"La categoria no existe" , error:true})
    }


}


export {getExpenseList, addExpense}