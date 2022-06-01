const express = require('express')
const expressLayouts = require('express-ejs-layouts');

let app = express()

// * Locals
app.locals.BASE_URL = process.env.BASE_URL

// * View Engine 
app.set('views', './frontend/views')
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/common');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("layout extractMetas", true);

// Web Routes
app.use(`/`, require('./routers/auth.route'));
app.use(`/p/`, require('./routers/monitoring.route'));
app.use(`/m/`, require('./routers/moa_mou.route'));

module.exports = app