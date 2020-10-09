const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homecontroller');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos );

    // Crear  Vacantes
    router.get('/vacantes/nueva',
     authController.verificarUsuario,
     vacantesController.formularioNuevaVacante
    );

    router.post('/vacantes/nueva',
     authController.verificarUsuario,
     vacantesController.validarVacante,
     vacantesController.agregarVacante
    );
   
   // Mostrar Vacante (singular)
    router.get('/vacantes/:url', vacantesController.mostrarVacante);
   
    // Edita una vacante
    router.get('/vacantes/editar/:url',
     authController.verificarUsuario, 
     vacantesController.formEditarVacante
    );

    router.post('/vacantes/editar/:url',
      authController.verificarUsuario,
      vacantesController.validarVacante,
      vacantesController.editarVacante
    );

    // Eliminar Vacantes
    router.delete('/vacantes/eliminar/:id',
      vacantesController.eliminarVacante
    );

   // Crear Cuentas
   router.get('/crear-cuenta', usuariosController.formCrearCuenta);
   router.post('/crear-cuenta',
     usuariosController.validarRegistro,
     usuariosController.crearUsuario
   );

   // Autenticar usuarios
   router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
   router.post('/iniciar-sesion', authController.autenticarUsuario);
   
  // Cerrar sesion
  router.get('/cerrar-sesion',
    authController.verificarUsuario,
    authController.cerrarSesion
  );


   // Panel de administracion 
   router.get('/administracion',
    authController.verificarUsuario,
    authController.mostrarPanel
  );
   
    // Editar Perfil
    router.get('/editar-perfil',
        authController.verificarUsuario,
        usuariosController.formEditarPerfil
    );
    router.post('/editar-perfil', 
        authController.verificarUsuario,
        // usuariosController.validarPeril,
        usuariosController.subirImagen,
        usuariosController.editarPerfil
    );

    // Recibir mensajes de candidatos
    router.post('/vacantes/:url',
      vacantesController.subirCV,
      vacantesController.contactar
    );





    return router;
}