import { CategoryList, ExpenseList } from "../models";


const getExpenseList = async (req, res) => { //Para pedir el listado de categorias
    const {user} = req //Este user viene dado por el checkAuth
    const expenseList = await ExpenseList.findOne({userID: user._id}).select("expenses -_id") //Buscamos la expenseList del usuario, y le sacamos la info que no nos sirve
    if (!expenseList){
        const error = new Error ("Listado de gastos no encontrado")
        res.status(400).json({ msg: error.msg })
    }
    res.json(expenseList)
}

const addExpense = async (req, res) => {
    const {user} = req
    const { expenseName, expenseValue, expenseDate, expenseCategoryName } = req.body
    const expenseList = await ExpenseList.findOne({userID: user._id}) //arrancamos con buscando la lista

    if (!expenseList){
        const error = new Error ("Listado de gastos no encontrado")
        res.status(400).json({ msg: error.msg })
    }

    const categoryList = await CategoryList.findOne ({ userID: user._id})

    if (!categoryList){
        const error = new Error ("Listado de categorias no encontrado")
        res.status(400).json({ msg: error.msg })
    }

    const category = categoryList.categories.find(category => category.name === expenseCategoryName);

    if (!category) {
        const error = new Error ("Categoría no encontrada")
        res.status(400).json({ msg: error.msg })
    }

    const expenseExists = expenseList.expenses.find(expense => expense.name === expenseName); //Nos aseguramos que el item no exista
    if(!expenseExists || expenseList.expenses === []){
        expenseList.expenses.push({name: expenseName, value: expenseValue, date: expenseDate, categoryID: category._id}) //Agregamos la categoria a la lista
        try {
            await expenseList.save(); //Guardamos la nueva lista
            res.status(201).json({msg: "Gasto creado exitosamente"});
        } catch (error) {
            return res.status(409).json({msg: `Ocurrió un error: ${error}`})
        }
    } else {
        return res.status(400).json({msg:"El gasto ya existe"})
    }
}

