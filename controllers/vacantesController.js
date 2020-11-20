const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

const multer = require('multer');
const shortid = require('shortid');



exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

// Agrega las vacantes a la base de datos
exports.agregarVacante = async(req, res) => {
    const vacante = new Vacante(req.body);

    // Usuario autor de la vacante
    vacante.autor = req.user._id;

    // crear arreglo de actividades
    vacante.skills = req.body.skills.split(',');

    // Almacenar en base de datos
    const nuevaVacante = await vacante.save();

    // Redireccionar
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

exports.mostrarVacante = async(req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).populate('autor');

    // si no hay resultados
    if (!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    })
}

exports.formEditarVacante = async(req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url });

    if (!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

exports.editarVacante = async(req, res) => {
    const vacanteActualizada = req.body;

    vacanteActualizada.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({ url: req.params.url },
        vacanteActualizada, {
            new: true,
            runValidators: true
        });

    res.redirect(`/vacantes/${vacante.url}`);
}


// Validar y sanitizar los campos de las nuevas vacantes
exports.validarVacante = (req, res, next) => {
    // sanitizar los campos
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();

    // Validar
    req.checkBody('titulo', 'Agrega un titulo a la Vacante').notEmpty();
    req.checkBody('empresa', 'Agrega una Empresa').notEmpty();
    req.checkBody('ubicacion', 'Agrega una ubicacion').notEmpty();
    req.checkBody('contrato', 'Selecciona el tipo de contrato').notEmpty();
    req.checkBody('skills', 'Agrega almenos una habilidad').notEmpty();

    const errores = req.validationErrors();

    if (errores) {
        // recargar la vista
        req.flash('error', errores.map(error => error.msg));

        res.render('nueva-vacante', {
            nombrePagina: 'Nueva Vacante',
            tagline: 'Llena el formulario y publica tu vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })
    }
    next(); // siguiente middleware
}

exports.eliminarVacante = async(req, res) => {
    const { id } = await req.params;

    const vacante = await Vacante.findById(id);

    if (verificarAutor(vacante, req.user)) {
        // el usuario actual  es el autor la vacante, puede eliminar
        vacante.remove();
        res.status(200).send('Vacante Eliminada Correctamente');

    } else {
        // el usuario actual no es el autor de la vacante no puede borrar o editar 
        res.status(403).send('Error');
    }

}

const verificarAutor = (vacante = {}, usuario = {}) => {
    if (!vacante.autor.equals(usuario._id)) {
        return false;
    }
    return true;
}

// Subir archivos en PDF

exports.subirCV = (req, res, next) => {
    upload(req, res, function(error) {

        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: el maximo son 1mb');
                } else {
                    req.flash('error', error.message);
                }

            } else {
                req.flash('error', error.message);
            }  
            res.redirect('back');
            return;
        }else {
            return next();
        }
    });
}

// opciones de multer
const configuracionMulter = {
    limits : {fileSize : 1000000},
    storage: filestorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/cv');
        },
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'application/pdf' ) {
            // el callback se ejecuta como true o false :  true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato no Valido'), false);
        }
    }
};

const upload = multer(configuracionMulter).single('cv');

// Almacenar los candidatos en la base de datos
exports.contactar = async(req, res, next) => {

    const vacante = await Vacante.findOne({url: req.params.url});

    if (!vacante) return next();

    // todo bien construir en nuevo objeto
    const nuevoCandidato = {
        nombre: req.body.email,
        email: req.body.email,
        cv: req.file.filename
    }

    // Almacenar la vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    // mensaje flash y redirecciion
    req.flash('correcto', 'Se envio tu Curriculum Correctamente');
    res.redirect('/');
}

exports.mostrarCandidatos = async (req, res, next) => {
 const vacante = await Vacante.findById(req.params.id);

 if (vacante.autor != req.user._id.toString()) return next();

 if (!vacante) return next(); 

 res.render('candidatos', {
     nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
     cerrarSesion: true,
     nombre: req.user.nombre,
     imagen: req.user.imagen,
     candidatos: vacante.candidatos
 })
 
}

// Buscador de Vacantes
exports.buscarVacantes = async (req, res) => {
    const vacantes = await Vacante.find({
        $text : {
            $search : req.body.q
        }
    });

   //mostrar Vacantes
   res.render('home', {
       nombrePagina: `Resultados para la búsqueda ${req.body.q}`,
       barra: true,
       preloader: true,
       vacantes
   })
}