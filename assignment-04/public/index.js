let title  = document.querySelector("#title");

let usernameField = document.querySelector('#usernameField');
let passwordField = document.querySelector('#passwordField');

let loginButton = document.querySelector("#loginButton");
let dataButton  = document.querySelector("#dataButton");

loginButton.addEventListener("click", e => {
  console.log("Login button clicked");

  let user = {
    'username': usernameField.value,
    'password': passwordField.value 
  }; 

  if(user.username == '' || user.password == '')
    return; 

  let url = '/login'; 

  fetch(url, {
    method: "POST", 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
    .then(response => response.json())
    .then(json => {
      localStorage.setItem('token', json.jwt); 
      title.innerHTML = 'You are logged in!';
    })
    .catch(error => {
      console.error(error);
      title.innerHTML = 'You are not logged in!';
    }); 
});

dataButton.addEventListener("click", e => {
  console.log("Fetch data button clicked");

  let url = '/api/person/1';
  let token = localStorage.getItem('token'); 

  fetch(url, {
    method: "GET", 
    headers: { 'x-access-token': token },
  })
    .then(response => response.json())
    .then(json => {
      alert(JSON.stringify(json));
      refreshToken(token); 
    })
    .catch(error => console.error("Error: ", error));
});

function refreshToken(token){
  let url = '/token';

  fetch(url, {
    method: "GET", 
    headers: { 'x-access-token': token },
  })
    .then(response => response.json())
    .then(json => localStorage.setItem('token', json.jwt))
    .catch(error => console.error("Error: ", error));
}