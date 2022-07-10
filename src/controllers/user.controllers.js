import User from "../models/User.js";
import { createJWT, createJWTConfirmed } from "../helpers/createJWT.js";
import { emailForgot, emailToken } from "../helpers/emailHelper.js";


//Este controlador crea un nuevo usuario.
const createNewUser = async (req, res) => {
    try{
        const { email } = req.body; // se extrae el email
        const existUser = await User.findOne ({email: email})
        if (existUser) {
            const error = new Error("Usuario ya está registrado")
            console.log(error);//Sacar
            return res.status(400).json({msg: error.message})
        } //Si ya existe devolvemos un error

        const user = new User(req.body)
        user.token = createJWTConfirmed(user.email) //Sin restricción de tiempo. Solo queremos un token que vamos a usar para el confirmed
        await user.save(); //Aca iria el metodo del mail para el confirmed
        emailToken(user)
        res.json({
            msg: "Usuario creado con exito, recibirá un email para confirmar su cuenta"
        });

    } catch(error) {
        console.log(error)//Sacar
        return res.status(400).json({
            msg: `Lo sentimos, ocurrio un error al crear el usuario. Por favor, comunique el siguiente codigo a un administrador ${error}`
        })
    }
}

// Para el logueo
const authenticate = async (req, res) => {
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

// Para el confirmar la cuenta
const confirmed = async (req, res) => {
    const { token } = req.params; //extraemos el token de la url
    const userConfirmed = await User.findOne ({token: token})
    console.log(token) //Sacar
    console.log(userConfirmed) //Sacar
    if (!userConfirmed){
        const error = new Error("incorrect Token");
        return res.status(400).json({msg: error.message}); //Hay que hacer una view para el caso de que se ingrese a una página con token incorrecto. O usar 
    }

    try{
        userConfirmed.confirmed = true;
        userConfirmed.token = ""; //dejamos el token vacio, ya que la cuenta ya está confirmada. Hay un caso extremo que generaria problemas, en el caso de que el usuario se olvide la contraseña antes de confirmar su cuenta. Por ahí en lugar de un solo token, hacer dos tokens distintos
        await userConfirmed.save();
        res.json({msg: "Usuario confirmado con éxito"})
    } catch(error) {
        console.log(error)//Sacar
        return res.status(400).json({
            msg: `Lo sentimos, ocurrio un error al confirmar el usuario. Por favor, comunique el siguiente codigo a un administrador ${error}`
        })
    }
}




export {createNewUser, authenticate, confirmed}