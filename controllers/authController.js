const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const Usuarios = mongoose.model('Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');




exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Revisar si el usuario esta autenticado o no
exports.verificarUsuario = (req, res, next) => {

    // verificar el usuario 
    if (req.isAuthenticated()) {
        return next(); // estan autenticados
    }

    // redireccionar 
    res.redirect('/iniciar-sesion');
}


exports.mostrarPanel = async (req, res) => {


    // Consultar el usuario autenticado
    const vacantes = await Vacante.find({ autor: req.user._id });


    res.render('administracion', {
        nombrePagina: 'Panel de Administración',
        tagline: 'crea y administra tus vacantes desde aqui',
        cerrarSesion: true,
        preloader: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        vacantes
    })
}

// cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.logout();
    req.flash('correcto', 'Cerraste sesion correctamente');
    return res.redirect('/iniciar-sesion');
}

/**Formulario para reestablecer el password */
exports.formReestablecerPassword = (req, res, next) => {
    res.render('reestablecer-password', {
       nombrePagina: 'Reestablece tu password',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
    })
}

// Genera el token y lo almacena en el objeto de usuario
exports.enviarToken = async (req, res, next) => {
    const usuario = await Usuarios.findOne({ email: req.body.email });

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    // el usuario existe generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000; // una hora

    // Guardar el usuario 
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    console.log(resetUrl);

    //TODO  : enviar notificacion por email
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reset'
    });

    req.flash('correcto', 'Revisa tu email para las indicaciones');
    res.redirect('/iniciar-sesion');
}

// valida si el token es valido y el usuario existe muestra la vosta
exports.reestablecerPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        token : req.params.token,
        expira: {
            $gt: Date.now()
        }
    });


    if(!usuario) { 
        req.flash('error', 'El token ya no es valido genera uno nuevo');
        return res.redirect('/reestablecer-password');
    }

    // Mostrar el formulario
    res.render('nuevo-password', {
        nombrePagina: 'Nuevo Password'
    })
}

// Almacena el nuevo password en la db
exports.guardarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        token : req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    // no existe el usuario o el token es invalido
    if(!usuario) { 
        req.flash('error', 'El token ya no es valido genera uno nuevo');
        res.redirect('/reestablecer-password');
    }

    // Asignar nuevo password
    usuario.password = req.body.password;

    //Limpiar valores previos
    usuario.token = undefined;
    usuario.expira = undefined;

    // guardar objeto de usuario
    await usuario.save();

    // redirigir
    req.flash('correcto', 'password Modificado Correctamente');
    return res.redirect('/iniciar-sesion');
}