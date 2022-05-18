$('#login__form').on('submit', (e) => {
  e.preventDefault();
  
  const email = $('#userEmail').val();

  if(email === "user@pupqc.com") {
      location.assign('./user');
  } else if(email === "admin@pupqc.com") {
      location.assign('./admin');
  } else if(email === "chief@pupqc.com") {
      location.assign('./chief');
  } else {
      alert('Invalid user');
  }
});