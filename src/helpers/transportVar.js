

const transportVar2 = (user, pass) =>{
  return{ // Este es el transport var de mi mailtrap, lo estoy usando de prueba para ver si funca, pueden hacerse uno o avisarme si quieren probar algo y lo vemos
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
    user: user,
    pass: pass
    }}
  };


const transportVar1 = (user, pass) =>  {//Este son los datos para hacer la conexión con el outlook, habria que crear una cuenta para usarlo.
    return {
    host: "smtp.office365.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3',
       requireTLS:true
    },
    auth: {
        user: user,//hay que cambiar estos dos datos para usarlo
        pass: pass
    }}
  };

  export { transportVar1, transportVar2}