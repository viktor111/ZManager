const DbContext = require('../config/dbContext');
const Mailer = require("../helpers/Mailer");
const KeyGenerate = require("../Helpers/randomNumGenerator")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


class Auth {

    SaveUser(User) {

        let mailer = new Mailer();

        const thankMessge = "Thank you for registering to ZManager!"
        
        mailer.SendEmail(User.email, thankMessge, thankMessge);

        let randomKey = KeyGenerate(9, 0);

        const dbContext = new DbContext().Initialize("admins");
        
        bcrypt.hash(User.password, 12, (err, hash) => {

            if (err) return console.log(err);

            return dbContext.add({

                username: User.username,
                email: User.email,
                password: hash.toString(),
                created: User.created,
                isAdmin: true,
                key: randomKey,
                profileCreated: false,                
            })
        })
      
    }  
    
    JWTAuthenticate(credentials, expirySec, jwtKey){

        const token = jwt.sign(credentials, jwtKey, {
            
            algorithm: "HS256",
            expiresIn: expirySec
        })

        return token;
    }

    ResetPassword(){
        
    }
}

module.exports = Auth;