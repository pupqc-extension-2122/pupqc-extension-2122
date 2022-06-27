/**
 * ============================================================================
 * * USER
 * ============================================================================
 */

const User = (() => {

  // * Local Variables

  let user;
  let initialized = false;

  // * Private Methods
  
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

  // * Init
  
  const init = () => {
    if (!initialized) {
      initialized = true;
      setUserVariable();
    }
  }

  // * Return Public Methods

  return {
    init,
    getData,
    setData,
    getName
  }
})();

User.init();