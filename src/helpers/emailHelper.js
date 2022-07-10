import nodemailer from "nodemailer";
import {transportVar2 } from "./.transportVar.js";

export const transportVar = { // Este es el transport var de mi mailtrap, lo estoy usando de prueba para ver si funca, pueden hacerse uno o avisarme si quieren probar algo y lo vemos
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
    user: "52fc1095aba05e",
    pass: "787ee01ee5f8d7"
    }
  };
  
const emailTemplateConfirmed = (name, token) => `<!DOCTYPE html>
<html lang="en">
  <head>
    ...
    <style>
    button a{color:red;}
      p {color:blue;}
    </style>
  </head>
  <body>
    <p>Hola ${name}, por favor, confirmá tu email</p>
    <p> Tu cuenta está casi lista</p>
    <button><a href="http://localhost:3000/confirmed/${token}"> Click Here </a></button>
    <p> Si no te registraste en APPGASTOS, podes ignorar este email </p>
   
  </body>
</html>`; //CAMBIAR NOMBRE !!!

const emailTemplateForgot = (name, token) => `<!DOCTYPE html>
<html lang="en">
  <head>
    ...
    <style>
    button a{color:red;}
      p {color:blue;}
    </style>
  </head>
  <body>
    <p>Hola ${name}, te enviamos este email para reestablecer tu contraseña</p>
    <button><a href="http://localhost:3000/forgot/${token}"> Por favor, clickea aquí </a></button>
    <p> Si no olvidaste tu contraseña, podes ignorar este email </p>
   
  </body>
</html>`; //CAMBIAR NOMBRE !!!

export const emailToken = async (user) => {
  const { email, name, token } = user;
  const transport = nodemailer.createTransport(transportVar);
  const info = await transport.sendMail({
    from: '"APP GASTOS - Cuentas de usuario" <prueba@APPGASTOS.com>', //CAMBIAR NOMBRE !!!
    to: email,
    subject: "APP GASTOS - Confirma tu cuenta", //CAMBIAR NOMBRE !!!
    text: "Confirma tu cuenta de APP GASTOS", //CAMBIAR NOMBRE !!!

    html: emailTemplateConfirmed(name, token)
  });
};

export const emailForgot = async (user) => {
  const { email, name, token } = user;
  const transport = nodemailer.createTransport(transportVar);
  const info = await transport.sendMail({
    from: '"APP GASTOS - Cuentas de usuario" <prueba@APPGASTOS.com>', //CAMBIAR NOMBRE !!!
    to: email,
    subject: "APP GASTOS - Reestablecer Contraseña", //CAMBIAR NOMBRE !!!
    text: "Por favor, cambie su contraseñá",
    html: emailTemplateForgot(name, token)
  });
};
