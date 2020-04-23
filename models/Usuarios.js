const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
/* bcrypt funciona mejor  con mongoose a diferencia
de bcrypt-node que funciona mejor con sequelize*/
const bcrypt = require('bcrypt'); 

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expira: Date,
    imagen: String
});

// metodo par hashear los paswords
usuariosSchema.pre('save', async function(next) {
    // si el pasword ya esta hasheado
    if(!this.isModified('password')){
        return next();
    }
    // si no esta hasheado
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
});

// Envia alerta un usuario ya esta registrado
usuariosSchema.post('save', function(error, doc, next){
    if(error.name === 'MongoError' && error.code === 11000 ) {
        next('El correo ingresado ya ha sido registrado');
    } else {
        next(error);
    }
});

// autenticar Usuarios
usuariosSchema.methods = {
    compararPassword: function(password) {
        return bcrypt.compareSync(password, this.password );
    }
}

module.exports = mongoose.model('Usuarios', usuariosSchema);