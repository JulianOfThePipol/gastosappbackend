import nodemailer from "nodemailer";
import { transportVar1 } from "./transportVar.js";


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
    <button><a href="https://gastos-app-develop.vercel.app/confirmed/${token}"> Click Here </a></button>
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
    <button><a href="https://gastos-app-develop.vercel.app/forgot/${token}"> Por favor, clickea aquí </a></button>
    <p> Si no olvidaste tu contraseña, podes ignorar este email </p>
   
  </body>
</html>`; //CAMBIAR NOMBRE !!!

export const emailToken = async (user) => {
  const { email, name, tokenConfirm } = user;
  const transport = nodemailer.createTransport(transportVar1(process.env.USER_MAILTRAP,process.env.PASS_MAILTRAP));
  const info = await transport.sendMail({
    from: '"APP GASTOS - Cuentas de usuario" <prueba@APPGASTOS.com>', //CAMBIAR NOMBRE !!!
    to: email,
    subject: "APP GASTOS - Confirma tu cuenta", //CAMBIAR NOMBRE !!!
    text: "Confirma tu cuenta de APP GASTOS", //CAMBIAR NOMBRE !!!

    html: emailTemplateConfirmed(name, tokenConfirm)
  });
};

export const emailForgot = async (user) => {
  const { email, name, tokenForgot } = user;
  const transport = nodemailer.createTransport(transportVar1(process.env.USER_MAILTRAP,process.env.PASS_MAILTRAP));
  const info = await transport.sendMail({
    from: '"APP GASTOS - Cuentas de usuario" <prueba@APPGASTOS.com>', //CAMBIAR NOMBRE !!!
    to: email,
    subject: "APP GASTOS - Reestablecer Contraseña", //CAMBIAR NOMBRE !!!
    text: "Por favor, cambie su contraseñá",
    html: emailTemplateForgot(name, tokenForgot)
  });
};
