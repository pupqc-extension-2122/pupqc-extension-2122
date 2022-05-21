const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

let app = express();

// * Locals
app.locals.BASE_URL = process.env.BASE_URL

// * Static Files
app.use('/plugins', express.static('./static/plugins'));
app.use('/img', express.static('./static/img'));
app.use('/js', express.static('./static/dist/js'));

// * Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));

// * View Engine 
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/common');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("layout extractMetas", true);


/**
 * * Routers
 */

// *** API Routers *** //


// *** Web Routers *** //
app.use('/auth', require('./modules/auth'));
app.use(`/`, require('./routers/web/monitoring.route'));

// * Port
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App is running on port ${ PORT }!`));