const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');
const { port } = require('../config/email');

let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  }
});

const handlebarOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: __dirname+'/../views/partials',
    layoutsDir: __dirname+'/../views/layouts',
    defaultLayout: 'layout',
  },
  viewPath: __dirname+'/../views/emails',
  extName: '.handlebars',
};

// Utilizar templates de handlebars
transport.use('compile', hbs(handlebarOptions) );

exports.enviar = async (opciones) => {
  const opcionesEmail = {
    from: 'techjobs <noreply@techjobs.com',
    to: opciones.usuario.email,
    subject: opciones.subject,
    template: opciones.archivo,
    context: {
      resetUrl: opciones.resetUrl
    }
  }

  const sendMail = util.promisify(transport.sendMail, transport);
  return sendMail.call(transport, opcionesEmail);
  
}

