class Firebase {

    constructor(serviceAccount) {

        this.serviceAccount = serviceAccount;
    }

    connect() {

        const firebaseAdmin = require('firebase-admin');

        try {

            firebaseAdmin.initializeApp({

                credential: firebaseAdmin.credential.cert(this.serviceAccount),
                databaseURL: "https://zmanager-c47d0.firebaseio.com"

            });

            console.log("[+]Succsessfully authenticated to firebase...")

        }

        catch (err) {

            console.log(err)
        }
    }
}


module.exports = Firebase;