import mongoose from "mongoose";

const expenseSchema = mongoose.Schema({
    expenses:[{
        name: {
            type: String,
            required: true, // hace que este campo sea obligatorio
            trim: true // te quita los espacios de adelante y de atras
        },

        value: {
            type: Number, //Habria que ver como reacciona a los decimales. Round a dos decimales por ahora, y si tenemos tiempo ver de hacer algo para mas precisión.
            required: true,
            trim: true 
        },

        date: {
            type: Date,
            required: true
        }, // La fecha en la cual ocurrio el gasto. Por ahora el dia nomás, habria que ver si le agregamos

        categoryID: {
            type: String,
            required: true,
            ref: "Category"
        }
    }],

    userID: {
        type: String,
        required: true,
        ref: "User"
    }

  },
)

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;