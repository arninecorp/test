const express = require('express');
const redis = require('redis');
const crypto = require('crypto');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
})); 

const createRandomSha256 = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                const hash = crypto.createHash('sha256');
                hash.update(buffer);
                const hashHex = hash.digest('hex');
                resolve(hashHex);
            }
        });
    });
};

app.post('/password/reset', (req, res) => {
    createRandomSha256()
        .then((hash) => {
            const token = hash;
            const email = req.body.email;

            const client = redis.createClient();
            client.connect()
                .then(() => {
                    client.set(token, email, "EX", 60 * 60);
                    client.set(email, token, "EX", 60 * 60)
                        .then(() => {
                            sendPasswordResetEmail(email, token);
                            res.send('Password reset email sent');
                        })
                        .catch((err) => {
                            res.status(500).send(err.message);
                        });
                });
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

app.post('/password/verify', (req, res) => {
    const token = req.body.token;
    const email = req.body.email;
    const newPassword = req.body.newPassword;

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (newPassword){
        if (emailRegex.test(email)) {
            const client = redis.createClient();
            let keepGoing = true;
            client.connect()
                .then(() => {
                    client.keys(token)
                        .then((keys) => {
                            if (keys && keys.length > 0) {
                                for (let i = 0; i < keys.length; i++) {
                                    const key = keys[i];
                                    client.get(key)
                                        .then((value) => {
                                            if (value===email) {
                                                if (keepGoing) {
                                                    keepGoing = false;
                                                    setNewPassword(email, newPassword);
                                                    res.status(200).send({result: 'Succcess'});
                                                }
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            res.status(500).send(err.message);
                                        });
                                }
                            } else {
                                res.status(200).send({result: 'Token is not valid'});
                            }
                        });
                });
          } else {
            res.status(500).send("not a valid email address");
          }
    }
});

function sendPasswordResetEmail(email, token){
    // Assume this function works as expected
    return true
}

function setNewPassword(email, password){
    // Assume this function works as expected
    return true
}

app.listen(1337, () => {
    console.log("Server listening on port 1337");
  });