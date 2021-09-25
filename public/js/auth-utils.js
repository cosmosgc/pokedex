const baseURL = "http://localhost:3000"
const loginURL = `${baseURL}/login.html`
const signUpURL = `${baseURL}/signup.html`
const dashboardURL = `${baseURL}/dashboard.html`

function ensureAuthenticated() {
    if (!checkAuthenticated()) window.location.replace(loginURL);
    else window.location.replace(dashboardURL);
  }
  
  function checkAuthenticated() {
    const user = localStorage.getItem('@PokeApp:user');
    const token = localStorage.getItem('@PokeApp:token');
  
    return user && token
  }
  
  function retrieveUserData() {
    if (!checkAuthenticated()) {
      window.location.replace(loginURL);
      return
    }
  
    return JSON.parse(localStorage.getItem('@PokeApp:user'));
  }
  
  function retrieveUserToken() {
    if (!checkAuthenticated()) {
      window.location.replace(loginURL);
      return
    }
  
    return localStorage.getItem('@PokeApp:token');
  }

function setUserData(data) {
  return localStorage.setItem('@PokeApp:user', JSON.stringify(data));
}

function setUserToken(token) {
  return localStorage.setItem('@PokeApp:token', token);
}