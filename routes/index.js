const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homecontroller');


module.exports = () => {
    router.get('/', homeController.mostrarTrabajos );

    return router;
}