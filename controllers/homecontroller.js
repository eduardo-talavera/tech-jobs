const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.mostrarTrabajos = async(req, res, next) => {

    const vacantes = await Vacante.find();

    if (!vacantes) return next();

    res.render('home', {
        nombrePagina: 'Fast Jobs',
        tagline: 'Encuentra y publica Trabajos Rapido',
        barra: true,
        boton: true,
        nave: true,
        vacantes,
    });
}