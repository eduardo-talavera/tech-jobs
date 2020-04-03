exports.mostrarTrabajos = (req, res) => {
    res.render('home', {
        nombrePagina: 'Jobs',
        tagline: 'Encuentra y publica Trabajos',
        barra: true,
        boton: true
    });
}