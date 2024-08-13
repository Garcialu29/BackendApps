const express = require('express');

//const { listen } = require('express/lib/application');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');


//const { json } = require('express/lib/response');
//const req = require('express/lib/request');

/*require('./config/passport')(passport);*/



/*
* IMPORTAR RUTAS
*/
const PassportJwt = require('./config/passport');

const usersRoutes = require('./routes/userRoutes');
const paquetesRoute = require('./routes/paqueteRoutes');
const rastreoRoute = require('./routes/rastreoRoutes');

const  port = process.env.PORT || 3000;


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false}
}));
// Configuración de Passport.js
app.use(passport.initialize());
app.use(passport.session());

//require('./config/passport')(passport);


app.disable('x-powered-by');

app.set('port', port);

// Configuración de Passport JWT
PassportJwt(passport);

/*
* LLAMADO DE LAS RUTAS
*/
usersRoutes(app);
paquetesRoute(app);
rastreoRoute(app);


server.listen(3000, '194.164.64.100' || 'localhost', function(){
    console.log('app_traex ' + port + '  iniciado...')

});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

app.get('/', (req, res) => {
    res.send('Ruta Raiz del Backend');
});


module.exports =  {
    app:app,
    server:server
}
