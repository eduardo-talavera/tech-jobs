const express = require('express');
const exphbs= require('express-handlebars');
const path = require('path');
const router = require('./routes');



const app = express();

// Habilitar Handlebars como template engine
app.engine('handlebars',
    exphbs({
        defaultLayout: 'layout'
    })
);

app.set('view engine', 'handlebars');

//Statics files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router());


app.listen(5000);