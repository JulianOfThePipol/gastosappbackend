import User from "../models/User.js";



const createNewUser = async (req, res, next) => {
    try{
        const user = new User({})
        await user.save();
        res.json({
            msg: "Usuario creado con exito"
          });
    }
    catch(error){
        console.log(error)
    }

}

export {createNewUser}