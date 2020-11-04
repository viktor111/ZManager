const nodemailer = require('nodemailer');

class Mailer{
   
    SendEmail(emailToSend, textToSend, subjectToSend){

        let transporter = nodemailer.createTransport({

            service: "gmail",

            auth: {
                user: "zmanagerbot@gmail.com",
                pass: "viktor221"
            }
        })

        let mailOptions = {

            from: "zmanagerbot@gmail.com",
            to: emailToSend,
            subject: subjectToSend,
            text: textToSend
        }

        transporter.sendMail(mailOptions, (err, info) => {

            if(err){

                console.log(err);                
            }
            else{
                
                console.log("[+]Mail sent to: " + emailToSend);
            }
        })
    }
}

module.exports = Mailer;