import User from "../models/User.js";
import jwt  from "jsonwebtoken";

export default async function checkAuth (req, res, next) {
    console.log("Inicio del auth") //Sacar
    let token
    if( req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password -tokenConfirm -tokenForgot -isDeleted -confirmed -birthday -createdAt -updatedAt -__v");
            if (!req.user){return res.status(404).json({msg: "Habemus cagada, el usuario tiene un token válido, pero el id dentro del token no está en la base de datos", notLogged:true, error:true} )}//Este error es un caso extremo
            return next()
        } catch (error) {
            return res.status(401).json({msg: `Token erroneo, o fallo el decode. Mensaje de error: ${error}`, notLogged:true, error:true})
        }
    } else {
        res.status(401).json({msj: "El usuario no está logueado, o fallo el envió de su token", notLogged:true, error:true})
    }
}