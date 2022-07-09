import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
      // aca va toda la estructura de la tabla usuario
      name: {
        type: String,
        required: true, // hace que este campo sea obligatorio
        trim: true // te quita los espacios de adelante y de atras
      },
      lastName: {
        type: String,
        required: true, // hace que este campo sea obligatorio
        trim: true // te quita los espacios de adelante y de atras
      },
      password: {
        type: String,
        required: true, 
        trim: true
      },
      email: {
        type: String,
        required: true, 
        trim: true,
        unique: true
      },
      token: {
        type: String
      },
      birthday: {
        type: Date
      },
      isDeleted: {
        type: Boolean,
        default: false
      },
      confirmed: {
        // la idea es mandarle un email para confirmar su cuenta y ahi pasa a ser true
        type: Boolean,
        default: false
      }
    },
    {
      timestamps: true // crea 2 columnas, una de creado y otra de actualizado
    }
  );

const User = mongoose.model("User", userSchema);
export default User;
