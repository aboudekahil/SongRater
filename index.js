// Requires
// ----------------------------------------------------------------------------
require('dotenv').config(); // process env configure
const express = require('express');
const routings = require('./config/routers.config');
const bodyParser = require('body-parser');


// Express app middlewares
// ----------------------------------------------------------------------------
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routings);


// Start server
// ----------------------------------------------------------------------------
app.listen(process.env.PORT || 5000);
console.log(`Listening on http://localhost:${process.env.PORT}`);
