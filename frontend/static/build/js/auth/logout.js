/**
 * ==============================================
 * * LOGOUT
 * ==============================================
 */

'use strict';

$('[data-auth="logout"]').on('click', () => {
  $.ajax({
    url: `${ BASE_URL_API }/auth/logout`,
    success: res => {
      if(res.error) {
        toastr.error('Something went wrong. Please reload the page.');
        console.error(`[ERR]: ${ res.message }`);
      } else {
        toastr.info('Logging out.');
        setTimeout(() => location.replace(`${ BASE_URL_WEB }/login`), 750);
      }
    },
    error: () => {
      toastr.error('Something went wrong. Please reload the page.');
      console.error(`[ERR]: Failed to call ajax.`);
    }
  })
});