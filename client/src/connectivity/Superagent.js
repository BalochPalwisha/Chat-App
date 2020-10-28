const superagent = require('superagent');

const RETRY = 2;

const login = async (email, password, callback) => {

    let url = "http://192.168.86.54:3000/api/users/login"
    var user1 = superagent.agent();
    user1
        .post(url)
        .send({ email: email, password: password })
        .end(function (err, res) {
            if (!err) {
               // console.log(res)
                callback(res.text, err);
            } else {
                console.log('err', err)
                callback(null, err);
            }
            // user1 will manage its own cookies
            // res.redirects contains an Array of redirects
        });
}
const registerUser = async (username, email, password,password2, callback) => {

    console.log(username,email, password2, password)

    let url = "http://192.168.86.54:3000/api/users/register"
    var user1 = superagent.agent();
    user1
        .post(url)
        .send({name: username, email: email, password: password, password2: password2 })
        .end(function (err, res) {
            if (!err) {
               // console.log(res)
                callback(res.text, err);
            } else {
                
                callback(null, err);
            }
            // user1 will manage its own cookies
            // res.redirects contains an Array of redirects
        });
}

const getUsers = (callback) => {
    let url = "http://192.168.86.54:3000/api/chatUsers/getUsers";
    get(url, callback)
}



const get = (url, callback) => {
    console.log("URL: " + url);
    superagent
        .get(url)
        .retry(RETRY)
        .end((err, res) => {
            if (!err) {
                callback(res.body, err);
            } else {
                callback(null, err);
            }
        
        });
};



export default {
    login,
    registerUser,
    getUsers
}