const express       = require('express');
const logger        = require('morgan');
const fileUpload    = require('express-fileupload');
const bodyParser    = require('body-parser');// This will be our application entry. We'll setup our server here.
const http = require('http');
const cors = require("cors");
require('dotenv').config()

// Set up the express app
const app = express();

//cors
let header = {
     'Access-Control-Allow-Headers': '*',
     'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
     'Content-Type': 'application/json'
}
app.use(cors(header));

// Log requests to the console.
app.use(logger('dev'));


// enable files upload
app.use(fileUpload({
     createParentPath: true
}));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Setup a default catch-all route that sends back a welcome message in JSON format.
require('./routes')(app);
/*
app.get('*', (req, res) => res.status(200).send({
     message: 'Welcome to the beginning of nothingness.',
}));
*/

const port = parseInt(process.env.PORT, 10) || 8000;


app.set('port', port);
const server = http.createServer(app);
server.listen(port,()=>console.log(`App is listening on port ${port}.`));
module.exports = app;