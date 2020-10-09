const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.mostrarTrabajos = async(req, res, next) => {

    const vacantes = await Vacante.find();

    if (!vacantes) return next();

    res.render('home', {
        nombrePagina: 'TI Jobs',
        tagline: 'Publica y encuentra trabajos',
        barra: true,
        boton: true,
        nave: true,
        vacantes,
    });
}