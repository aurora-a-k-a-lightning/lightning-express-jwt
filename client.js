// get the jwt

const BASE_URL = "http://localhost:3000";
const loginFormHtml = `
    <div id="login-form-container">
        <h1>login</h1>
        <form id="login-form" name="login-form">
            <label for="email">email</label>
            <input id="email" type="email" placeholder="email" required />

            <label for="password">password</label>
            <input id="password" type="password" placeholder="password" required />

            <button id="login-button">login</button>
        </form>
    </div>
`;

function loggedInHtml(user) {
    return `
        <div id="logged-in-container">
            <h1>logged in</h1>
            <div>You are logged in!</div>
            <button id="logout-button">logout</button>
            <div id="user-info">
                <div>name: ${user.name}</div>
                <div>email: ${user.email}</div>
            </div>
        </div>
    `;
}

function login(event) {
    event.preventDefault();
    let data = JSON.stringify({
        email: event.currentTarget.elements.email.value,
        password: event.currentTarget.elements.password.value
    });

    let xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/token`, true);
    
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Request finished. Do processing here.
            const token = JSON.parse(this.response).token

            // set the token here
            window.localStorage.setItem('token', token);
            // now we can retrieve it later and send it on subsequent requests!

            // do stuff with the display
            setUser();
        } else if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 401) {
            // wrong credentials!
            showInvalidCredentialsMessage();
        }
    }
    xhr.send(data); 
}

// use the token to get the user!
function getUser() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${BASE_URL}/user`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${window.localStorage.getItem('token')}`);

    xhr.onload = function () {
        // Request finished. Do processing here.
        // this is preference here. the server sends back a user object. decide how to store it, or not
        window.localStorage.setItem('user', this.response);
        //display the user info
        let body = document.getElementsByTagName('body')[0];
        let loginForm = document.getElementById('login-form-container');
        loginForm.remove();

        body.insertAdjacentHTML('afterbegin', loggedInHtml(JSON.parse(this.response)));

        document.getElementById('logout-button').addEventListener('click', logout);
    };

    xhr.send();
}

function logout(event) {
    event.preventDefault();    
    unsetUser();
}

function setUser() {
    if (localStorage.getItem('token')) {
        getUser();
    }
}

function unsetUser() {
    window.localStorage.clear();
    let body = document.getElementsByTagName('body')[0];
    let loggedInForm = document.getElementById('logged-in-container');
    loggedInForm.remove();

    body.insertAdjacentHTML('afterbegin', loginFormHtml);

    document.getElementById('login-form').addEventListener('submit', login);
}

function showInvalidCredentialsMessage() {
    let incorrectLogin = document.createElement('div');
    incorrectLogin.innerText = 'Incorrect email or password';
    document.getElementById('login-form-container').appendChild(incorrectLogin);
}

document.getElementById('login-form').addEventListener('submit', login);

let logoutButton = document.getElementById('logout-button')
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

setUser();
