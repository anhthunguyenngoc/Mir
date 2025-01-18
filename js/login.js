function signInByPass(){
    window.open("/Mir/html/logins/login-by-pass.html", '_top');
}

function signInByCode(){
    window.open("/Mir/html/logins/login-by-pincode.html", '_top');
}

/*PostUsers_auth
Name                    Description                         Schema
password    optional                                        string
pincode     optional                                        string
username    optional    Min length: 2, Max length: 63       string
*/

function displayMaps(maps){
    console.log(maps)
}

async function confirmSignInByPass(){
    let pass = document.getElementById('pass').value;
    let username = document.getElementById('username').value;
    await setAuthorization(username, pass);
    console.log(authorization);
    body = {
        'password': pass,
        'username': username
    }
    postAPI('/users/auth', body, signInSuccessfully);
    getMaps("/maps", displayMaps);
}

function confirmSignInByCode(){
    let code1 = document.getElementById('code-01').value;
    let code2 = document.getElementById('code-02').value;
    let code3 = document.getElementById('code-03').value;
    let code4 = document.getElementById('code-04').value;
    let pincode = code1 + code2 + code3 + code4;
    body = {
        'pincode': pincode
    }
    postAPI('/users/auth', body, signInSuccessfully);
}

/*GetUsers_auth
{
  "ip": "<string>",
  "expiration_time": "<dateTime>",
  "user_id": "<string>",
  "token": "<string>",
  "login_time": "<dateTime>"
}
*/

function signInSuccessfully(usersAuth){
    console.log(usersAuth);
    loggingUser = usersAuth;
    window.open("/Mir/html/dashboards/dashboard.html", '_top');
}
