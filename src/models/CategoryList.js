import mongoose from "mongoose";

const categoryListSchema = mongoose.Schema({
    categories: [
        {
            name: {
                type: String,
                required: true, // hace que este campo sea obligatorio
                trim: true, // te quita los espacios de adelante y de atras
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
        ref: "User",
        unique: true
    }
        
        
  },
)

const CategoryList = mongoose.model("CategoryList", categoryListSchema);
export default CategoryList;