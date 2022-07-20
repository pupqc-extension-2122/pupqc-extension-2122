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

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

// Web Routes
app.use(`/`, require('./routers/auth.route'));

// Redirect if not logged in 
app.use((req, res, next) => {

  const user_cookies = ['from_magic','verified','user','roles'];

  // If user does not have enough privilege
  if (user_cookies.some(k => req.cookies[k] === undefined)) {

    // Make sure all cookies are clear (incase unwanted user manipulate cookies in front)
    user_cookies.forEach(k => req.cookies[k] && res.clearCookie(k));

    // Token also
    res.clearCookie('token');

    // Redirect to login
    return res.redirect('/login');
  }

  // If not verified, always redirect to change password
  if (req.cookies.verified == '0' || req.cookies.from_magic == '1') return res.redirect('/update-password');

  next();
});

app.use(`/p/`, require('./routers/projects.route'));
app.use(`/m/`, require('./routers/memo.route'));
app.use(`/a/`, require('./routers/admin.route'));
app.use(`/me/`, require('./routers/user_info.route'));
// app.use(`/t/`, require('./routers/test.route'));

// For 404
app.use((req, res, next) => {
  return res.status(404).render('content/errors/404', {
    layout: './layouts/error',
    document_title: '404 - Page not found',
  });
});

module.exports = app