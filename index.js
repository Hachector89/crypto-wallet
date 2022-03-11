

const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./database/config');
require('dotenv').config();

//create express server/app
const app = express();

//BBDD
dbConnection();

//public folder
app.use( express.static('public'));

//cors
app.use( cors() );

//parse and read body
app.use( express.json() );

// Routes
app.use( '/api/auth', require('./routes/auth'));

//Other routes
app.get( '*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html') );
});



app.listen( process.env.PORT, () => {
    console.log(`Server running in port ${ process.env.PORT }`);
} );

