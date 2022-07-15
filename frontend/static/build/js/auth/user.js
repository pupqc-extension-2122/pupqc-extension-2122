/**
 * ============================================================================
 * * USER
 * ============================================================================
 */

'use strict';

const User = (() => {

  // * Local Variables

  let user;
  let initialized = false;

  // * Private Methods

  const initializations = () => {

    // Check if cookies are present
    if (getCookie('roles') === '' || getCookie('user') === '') logout();

    // Logout
    $('[data-auth="logout"]').on('click', () => logout());
  }
  
  const setUserVariable = () => user = JSON.parse(localStorage.getItem(USER_DATA_KEY));

  // * Public Methods

  const getData = (key = null) => {
    if (key) {
      if (user.hasOwnProperty(key)) return user[key]
      else DEV_MODE && console.error('Invalid user data key')
    } else {
      return user;
    }
  }

  const setData = (arg1, arg2) => {
    if (typeof arg1 === 'object') {
      localStorage.setItem(USER_DATA_KEY, arg1);
      setUserVariable();
    } else if (typeof arg1 === 'string' && arg2) {
      if (user.hasOwnProperty(arg1)) {
        user[arg1] = arg2;
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      } else {
        DEV_MODE && console.error('Invalid user data key');
      }
    }
  }

  const getName = (format = 'F M. L, S') => {
    return formatName(format, {
      firstName: user.first_name,
      middleName: user.middle_name,
      lastName: user.last_name,
      suffixName: user.suffix_name
    });
  }

  const logout = () => {
    $.ajax({
      url: `${ BASE_URL_API }/auth/logout`,
      success: res => {
        if(res.error) {
          toastr.error('Something went wrong. Please reload the page.');
          ajaxErrorHandler(res.message);
        } else {
          toastr.info('Logging out.');
          localStorage.clear();
          setTimeout(() => location.replace(`${ BASE_URL_WEB }/login`), 750);
        }
      },
      error: () => {
        toastr.error('Something went wrong. Please reload the page.', {
          "timeOut": "0",
          "extendedTimeOut": "0",
        });
        console.error(`[ERR]: Failed to call ajax.`);
      }
    });
  }

  // * Init
  
  const init = () => {
    if (!initialized) {
      initialized = true;
      initializations();
      setUserVariable();
    }
  }

  // * Return Public Methods

  return {
    init,
    getData,
    setData,
    getName,
    logout
  }
})();

User.init();