const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

let app = express();

// * Static Files
app.use('/plugins', express.static('./frontend/static/plugins'));
app.use('/img', express.static('./frontend/static/img'));
app.use('/js', express.static('./frontend/static/dist/js'));
app.use('/uploads', express.static('./uploads'))

// * Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));

/**
 * * Routers
 */

// *** API Routes *** //
app.use('/api', require('./backend'));


// *** Web Routes *** //
app.use('/', require('./frontend'))

// * Port
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App is running on port ${ PORT }!`));