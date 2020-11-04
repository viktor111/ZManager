const DbContext = require('../config/dbContext');
const Mailer = require("../helpers/Mailer");
const KeyGenerate = require("../Helpers/randomNumGenerator")
const bcrypt = require('bcrypt');
const AuthService = require('../services/AuthService')
const UserModel = require("../models/userModel");

const jwtKey = "auth";

const GetRegister = (req, res) => {
    res.render("auth/register", { title: "Register" });
}

const GetResetPassword = (req, res) => {
    res.render("auth/resetPass", { title: "Reset Password" })
}

const GetLogin = (req, res) => {
    res.render("auth/login", { title: "Login" });
}

const PostRegister = async (req, res) => {
    let dbContext = new DbContext().Initialize("admins");

    let authService = new AuthService();

    let {Username, Email, Password} = req.body;

    let counter = 0;
    let querry = dbContext.where("email" , "==", Email).limit(1).get()
    .then((user) => {
        user.forEach(() => {
            counter++;
        })

        console.log(counter);

        if(counter !== 0){
            res.render("auth/register", {error: "Email already exits!"})
        }
        else if (Password.length < 4){
            res.render("auth/register", {error: "Passoword too small"})
        }
        else{
            let user = new UserModel(Username, Email, Password, new Date())
            authService.SaveUser(user);
            res.redirect("/");
            res.end();
        }
    })
    .catch(err => {
        console.error(err);
    })
}

const PostLogin = (req, res) => {
    let dbContext = new DbContext().Initialize("admins");

    let authService = new AuthService();

    let counter = 0;

    let {Username, Password} = req.body;

    let querry = dbContext.where('username', '==', Username).limit(1);

    let username;
    let admin;
    let password;
    let profileCreated;

    querry.get()
    .then((document) => {
        document.forEach((user) => {
            username = user['_fieldsProto']['username']['stringValue'];
            admin = user['_fieldsProto']['isAdmin']['booleanValue'];
            password = user['_fieldsProto']['password']['stringValue'];
            profileCreated = user['_fieldsProto']['profileCreated']['booleanValue'];

            counter++;
        })

        if(counter === 0){
            res.render("auth/register", {error: 'User does not exist register one!'});
        }

        bcrypt.compare(Password, password, (err, response) => {
            if(!response){
                res.render("auth/login", {error: "Wrong Password!"});
            }
            
            else{
                const expirySec = 300000;

                let token = authService.JWTAuthenticate({username, admin, profileCreated} , expirySec, jwtKey)

                res.cookie("token", token,{});

                res.redirect('/');
            }
        })
    })
}

const PostLogout = (req, res) => {
    res.clearCookie("token");
    res.redirect('/Auth/Login')
    res.end();
}

const SendResetEmail = (req, res) => {

    let dbContext = new DbContext().Initialize("admins");

    let { Email } = req.body;
    let querry = dbContext.where('email', '==', Email);

    querry.get()

        .then((document) => {

            if (!document) {

                res.render("Auth/ResetPass", { error: "Email dosent exist!" });
                res.end();
            }
            else {

                let mailer = new Mailer();
                let code;

                document.forEach((user) => {
                    code = user['_fieldsProto']['key']['stringValue'];
                })

                mailer.SendEmail(Email, code, "ZManager password reset code");

                res.render("Auth/ResetPass", { error: "Email sent!" });
                res.end();
            }
        })


}

const PostResetPassword = (req, res) => {

    let { Code, NewPassword, Email } = req.body;

    let dbContext = new DbContext().Initialize("admins");

    let dbCode;

    let querry = dbContext.where('email', '==', Email);


    bcrypt.hash(NewPassword, 12, (err, hash) => {

        querry.get()

            .then((document) => {

                if (!document) {

                    res.render("Auth/ResetPass", { error: "Email dosent exist!" });
                    res.end();
                }
                else {

                    document.forEach((user) => {
                        
                        const id = user.id;
                        dbCode = user['_fieldsProto']['key']['stringValue'];

                        if (dbCode !== Code) {

                            console.log(dbCode)

                            res.render("Auth/ResetPass", { error: "Wrong key!" })
                            res.end()
                        }
                        else if (NewPassword.length < 4) {

                            res.render("Auth/ResetPass", { error: "Password too small!" })
                            return res.end();
                        }
                        else {

                            let newKey = KeyGenerate(9, 0)

                            dbContext.doc(id).update({ password: hash });
                            dbContext.doc(id).update({ key: newKey });

                            res.render("Auth/ResetPass", { error: "Password changed!" })
                            res.end()
                        }
                    })
                }
            })
    })

}

module.exports = {
    GetLogin,
    GetRegister,
    GetResetPassword,
    PostRegister,
    PostLogin,
    PostLogout,
    SendResetEmail,
    PostResetPassword
}