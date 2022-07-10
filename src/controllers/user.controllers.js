import User from "../models/User.js";
import { createJWT, createJWTConfirmed } from "../helpers/createJWT.js";


//Este controlador crea un nuevo usuario.
const createNewUser = async (req, res, next) => {
    try{
        const { email } = req.body; // se extrae el email
        const existUser = await User.findOne ({email: email})
        if (existUser) {
            const error = new Error("Usuario ya está registrado")
            console.log(error);//Sacar
            return res.status(400).json({msg: error.message})
        } //Si ya existe devolvemos un error

        const user = new User(req.body)
        user.token = createJWTConfirmed("No hay nada aca adentro picarón!!") //Sin restricción de tiempo. Tampoco lleva info adentro, solo queremos un token con timer, el cual vamos a usar para el confirmed
        await user.save(); //Aca iria el metodo del mail para el confirmed
        res.json({
            msg: "Usuario creado con exito"
        });

    } catch(error) {
        console.log(error)//Sacar
        return res.status(400).json({
            msg: `Lo sentimos, ocurrio un error al crear el usuario. Por favor, comunique el siguiente codigo a un administrador ${error}`
        })
    }
}

// Para el logueo
const authenticate = async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email: email }); //Buscamos al usuario
    if (!user) {
        const error = new Error("El usuario no está registrado");
        return res.status(400).json({msg: error.message}); //Si no está, devolvemos un error
    }

    if (await user.checkPassword(password)) {
        
        if (!user.confirmed) {
            const error = new Error("Tu cuenta no está confirmada");
            return res.status(400).json({msg: error.message})
        }
        
        console.log(user) //Sacar
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: createJWT(user._id) // Aca va el token, con un timer, ya que este si tiene que expirar
        })
    } else {
        const error = new Error ("La contraseña es incorrecta")
        return res.status(400).json({msg: error.message})
    }
}




export {createNewUser, authenticate}