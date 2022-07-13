import { User, ExpenseList, CategoryList } from "../models/index.js";
import { createJWT, createJWTConfirmed, createJWTForgot } from "../helpers/createJWT.js";
import { emailForgot, emailToken } from "../helpers/emailHelper.js";
import jwt from "jsonwebtoken"


//Este controlador crea un nuevo usuario.
const createNewUser = async (req, res) => {
    
        const { email } = req.body; // se extrae el email
        const existUser = await User.findOne ({email: email})
        if (existUser) {
            const error = new Error("Usuario ya está registrado")
            console.log(error);//Sacar
            return res.status(400).json({msg: error.message})
        } //Si ya existe devolvemos un error
        
        try{
            const user = new User(req.body)
            const rawCategoryList = {
                userID: user._id,
                categories: [
                    {
                        name: "Inversiones",
                        color: "Green"
                    },
                    {
                        name: "Transporte",
                        color: "Red"
                    },
                    {
                        name: "Comida",
                        color: "Orange"
                    },
                    {
                        name: "Servicios",
                        color: "Blue"
                    },
                    {
                        name: "Otros",
                        color: "Yellow"
                    }
                ]
            }
            const categoryList = new CategoryList(rawCategoryList)
            const rawExpenseList = {
                userID: user._id,
                expenses: []
            }
            const expenseList = new ExpenseList(rawExpenseList)
            user.tokenConfirm = createJWTConfirmed(user.email) //Sin restricción de tiempo. Solo queremos un token que vamos a usar para el confirmed
            await user.save(); //Aca iria el metodo del mail para el confirmed
            await categoryList.save();
            await expenseList.save();
            emailToken({email: user.email, name: user.name, tokenConfirm: user.tokenConfirm})
            res.json({
                msg: "Usuario creado con exito, recibirá un email para confirmar su cuenta"
            });

        } catch(error) {
            console.log(error)//Sacar
            return res.status(400).json({
                msg: `Lo sentimos, ocurrio un error al crear el usuario. Por favor, comunique el siguiente codigo a un administrador ${error}`
            })
        }
};

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
};

// Para el confirmar la cuenta
const confirmUser = async (req, res) => {
    const { token } = req.params; //extraemos el token de la url
    const userConfirmed = await User.findOne ({tokenConfirm: token})
    console.log(token) //Sacar
    console.log(userConfirmed) //Sacar
    if (!userConfirmed){
        const error = new Error("Token incorrecto");
        return res.status(400).json({msg: error.message}); //Hay que hacer una view para el caso de que se ingrese a una página con token incorrecto. O usar 
    }

    try{
        userConfirmed.confirmed = true;
        userConfirmed.tokenConfirm = ""; //dejamos el token vacio, ya que la cuenta ya está confirmada. Hay un caso extremo que generaria problemas, en el caso de que el usuario se olvide la contraseña antes de confirmar su cuenta. Por ahí en lugar de un solo token, hacer dos tokens distintos. RESUELTO
        await userConfirmed.save();
        res.json({msg: "Usuario confirmado con éxito"})
    } catch(error) {
        return res.status(400).json({
            msg: `Lo sentimos, ocurrio un error al confirmar el usuario. Por favor, comunique el siguiente codigo a un administrador ${error}`
        })
    }
};

const forgotPassword = async (req, res) => {//Para el caso que el user se olvide la contraseña
    const { email } = req.body;
    const user = await User.findOne({email: email}); //buscamos si hay un usuario registrado con ese email
    if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(400).json({msg: error.message})
    }

    try {
        user.tokenForgot = createJWTForgot()//creamos un token con timer (1 dia)
        await user.save(); //Guardamos el token
        emailForgot({email: user.email, name: user.name, tokenForgot: user.tokenForgot})//enviamos el mail al user
        res.json({msg:"Enviamos un e-mail con instrucciones a su casilla"});
    } catch (error) {
        return res.status(400).json({
            msg: `Lo sentimos, ocurrio un error, por favor, intente nuevamente. Si el problema persiste, comunique el siguiente codigo a un administrador ${error}`
        })

    }
};

const checkForgotToken = async (req, res) => { //Aca checkeamos que el token sea valido, de serlo, ahi se mostraria la view para el cambio de contraseña
    const { token } = req.params;
    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch(err) {
        return res.status(400).json({ msg: "Su token es invalido o ha expirado." + err})
    }
    const validToken = await User.findOne ({ tokenForgot: token });
    if (validToken) {
        res.json({msg: "El token es correcto y el usuario existe"});   
    } else {
        const error = new Error ("Este token no fue generado por un usuario, o ya ha sido utilizado");
        return res.status(400).json({ msg: error.message })
    }
};

const changeForgotPassword = async (req, res) => {
    const { token } = req.params; //Sacamos el token, ya que lo vamos a verificar de nuevo antes de realizar el cambio de password
    const { password } = req.body; //Checkeamos de recibir una password
    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch(err) {
        return res.status(400).json({ msg: "Su token es invalido o ha expirado." + err})
    }// Seguramente hay una mejor forma de hacer esto. Ademas se podría modularizar esta porción de codigo, ya que la verificación del JWT va a ser utilizada en otros lares
    const user = await User.findOne({ tokenForgot: token }) //Checkeamos si tenemos un usuario guardado en la bdd que haya tenga dicho token
 
    if (user) {

        user.password = password; //Cambiamos la contraseña. En el modelo esta instaurado el bcrypt, para que realize el hasheo de la contra
        user.tokenForgot = ""; //Eliminamos el token despues de usarlo
        try {
            await user.save();
            res.json({ msg: "La contraseña se ha modificado exitosamente"});
        } catch (error) {
            return res.status(400).json({
                msg: `Lo sentimos, ocurrio un error, por favor, intente nuevamente. Si el problema persiste, comunique el siguiente codigo a un administrador ${error}`
            })
        }
    } else {
        const error = new Error( "Este token no fue generado por un usuario, o ya ha sido utilizado");
        return res.status(400).json({ msg: error.message });
    }
}

const userProfile = async (req, res) =>{
    const { user } = req;
    console.log(user) //Sacar
    const fullUser = await User.findById(user._id).select("-password -tokenForgot -tokenConfirm -isDeleted -confirmed  -updatedAt -__v");
    console.log("Logueado en el perfil de "+ fullUser.name) //Sacar
    res.json(fullUser)
}

const changeProfile = async (req, res) =>{
    const { user } = req;
    console.log("En controlador de cambio de nombre para el usuario" + user.name);
    const { name, lastName, birthday} = req.body;
    const fullUser = await User.findById(user._id);
    if (name === fullUser.name && lastName === fullUser.lastName){
        return res.status(400).json({msg: "No hubo cambios"})
    };
    if(name && fullUser.name !== name) {
        fullUser.name = name
    }
    if(lastName && fullUser.lastName !== name) {
        fullUser.name = name
    } //Por ahí podria cambiar esto y hacer un controlador para cada cambio, pero me parece mas engorroso
    try {
        await fullUser.save();
        res.json({msg: "Datos modificados con éxito"})
    } catch (error) {
        return res.status(400).json({msg: `Ha ocurrido un error: ${error}, sus datos no han sido modificados`})
    }
}


export {createNewUser, authenticate, confirmUser, forgotPassword, checkForgotToken, changeForgotPassword, userProfile, changeProfile}