const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE,{
    useUnifiedTopology: true,
    useNewUrlParser:true 
});

mongoose.connection.on('error', (error) => {
    console.log(error);
})

// importar los modelos
require('../models/Vacantes');
require('../models/Usuarios');
