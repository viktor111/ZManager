const jwt = require('jsonwebtoken')

const get = (req, res) => {
    const token = req.cookies.token;
    
    if (!token) {

        res.render('index', {title: "Home",logged: false});
    }
    else {       
        
        let payload = jwt.verify(token, 'auth')

        res.render('index', {title: "Home", username: payload.username, admin: payload.admin, logged: true});
    }
}
module.exports = {
    get,
};