import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    category: [
        {
            name: {
                type: String,
                required: true, // hace que este campo sea obligatorio
                trim: true // te quita los espacios de adelante y de atras
            },

            color: {
                type: String,
                required: true,
                trim: true 
            }
        },
    ],

    userID: {
        type: String,
        required: true,
        ref: "User"
    }
        
        
  },
)

const Category = mongoose.model("Category", categorySchema);
export default Category;