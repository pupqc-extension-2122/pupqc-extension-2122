const router = require('express').Router();
const PATH = 'auth/';
const user_cookies = ['from_magic','verified','user','roles'];

const hasPrivilege = (req) => user_cookies.every(k => req.cookies[k] !== undefined) && req.signedCookies.token;

const render404 = (res) => {
  return res.status(404).render('content/errors/404', {
    layout: './layouts/error',
    document_title: '404 - Page not found',
  });
}

const redirectToInternalPage = (req, res) => res.redirect(JSON.parse(req.cookies.roles).includes('Admin') ? '/a' : '/p');


// Redirect to login
router.get('/', (req, res) => {
  return hasPrivilege(req)
    ? redirectToInternalPage(req, res)
    : res.redirect('/login');
});


// Login
router.get('/login', (req, res) => {
  return hasPrivilege(req)
    ? redirectToInternalPage(req, res)
    : res.render(PATH + 'login', {
        layout: './layouts/auth',
        document_title: 'Login',
      });
});


// Forgot password
router.get('/forgot-password', (req, res) => {
  return hasPrivilege(req)
    ? redirectToInternalPage(req, res)
    : res.render(PATH + 'forgot_password', {
      layout: './layouts/auth',
      document_title: 'Forgot Password',
    });
});


// Change Password (For first timers)
router.get('/update-password', (req, res) => {
  if (hasPrivilege(req) && (req.cookies.verified == '0' || req.cookies.from_magic == '1')) {
    return res.render(PATH + 'change_password', {
      layout: './layouts/auth',
      document_title: 'Update your password',
    });
  } else {

    // Make sure all cookies are clear (incase unwanted user manipulate cookies in front)
    user_cookies.forEach(k => req.cookies[k] && res.clearCookie(k));

    // Token also
    if (req.signedCookies.token) res.clearCookie('token');
    
    // Return 404 page
    return render404(res);
  }
});


// Export module
module.exports = router;