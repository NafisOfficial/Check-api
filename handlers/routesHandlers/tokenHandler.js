/*-----------------------------
Description: CRUD
Author: Md. Nafis Iqbal,
Date: 07/04/2024,
email: nafisiqbal.net2002@gmail.ocm
------------------------------*/

// Dependencies
const lib = require('../../lib/data');
const { parseJSON, hashPassword, createRandomString } = require('../../helpers/utilities')


//module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];

    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback)
    } else {
        callback(405, {
            error: "method not allowed !"
        })
    }


}

handler._token = {};

handler._token.get = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === "string" && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        lib.read('tokens', id, (err, t) => {
            const token = parseJSON(t);
            if (err) {
                callback(404, {
                    error: "token was not found"
                })
            } else {
                callback(200, token)
            }
        })
    } else {
        callback(404, {
            error: "invalid id number !"
        })
    }
}

handler._token.post = (requestProperties, callback) => {

    const phone = typeof (requestProperties.body.phone) === "string" && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === "string" && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    lib.read('users', phone, (err, data) => {
        if (err) {
            callback(400, {
                error: "you have a problem in your request"
            })
        } else {
            let Password = hashPassword(password);
            if (parseJSON(data).password === Password) {
                let tokenId = createRandomString(20);
                let expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires
                }

                // store the token 
                lib.create('tokens', tokenId, tokenObject, (error) => {
                    if (error) {
                        callback(500, {
                            error: "there was a problem in your request !"
                        })
                    } else {
                        callback(200, tokenObject);
                    }
                })
            } else {
                callback(400, {
                    error: "phone number or password is not correct !"
                })
            }
        }
    })
}

handler._token.put = (requestProperties, callback) => {

    const id = typeof (requestProperties.body.id) === "string" && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;
    const isExtend = typeof (requestProperties.body.isExtend) === "boolean" && requestProperties.body.isExtend === true ? true : false;

    if (id && isExtend) {
        lib.read('tokens', id, (err, Token) => {
            if (err) {
                callback(404, {
                    error: "token was not found !"
                })
            } else {
                const userToken = parseJSON(Token);
                if (userToken.expires < Date.now()) {
                    callback(400, {
                        error: "token already expired"
                    })
                } else {
                    userToken.expires = Date.now() + 60 * 60 * 1000;
                    lib.update("tokens", id, userToken, (err) => {
                        if (err) {
                            callback(400, {
                                error: "failed to update token !"
                            })
                        } else {
                            callback(200, {
                                message: "token updated successfully !"
                            })
                        }
                    })
                }
            }
        })
    } else {
        callback(400, {
            error: "Please enter valid id and confirm !"
        })
    }

}

handler._token.delete = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === "string" && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        lib.read('tokens', id, (err, token) => {
            if (err && !token) {
                callback(404, {
                    error: "token was not found"
                })
            } else {
                lib.delete("tokens", id, (err) => {
                    if (err) {
                        callback(202, {
                            message: "logout successful"
                        })
                    } else {
                        callback(500, {
                            error: "failed to delete"
                        })
                    }
                })
            }
        })
    } else {
        callback(500, {
            error: "Invalid token id."
        })
    }
}

handler._token.verify = (id, phone, callback) => {
    lib.read('tokens', id, (error, token) => {
        if (error && !token) {
            callback(false);
        } else {
            const tokenObject = parseJSON(token);
            if (tokenObject.phone === phone && tokenObject.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
}


module.exports = handler;