const lib = require('../../lib/data');
const { hashPassword } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];

    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback)
    } else {
        callback(405, {
            error: "method not allowed !"
        })
    }


}

handler._users = {};

handler._users.get = (requestProperties, callback) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === "string" && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        const tokenId = typeof (requestProperties.headers.tokenid) === "string" && requestProperties.headers.tokenid.trim().length === 20 ? requestProperties.headers.tokenid : false;
        if(tokenId){
            tokenHandler._token.verify(tokenId,phone,(token)=>{
                if(token){
                    lib.read('users', phone, (err, u) => {
                        const user = parseJSON(u);
                        delete user.password;
                        if (err) {
                            callback(404, {
                                error: "user not found"
                            })
                        } else {
                            callback(200, user)
                        }
                    })
                }else{
                    callback(403,{
                        error: "unauthenticated user 2!"
                    })
                }
            });
        }else{
            callback(403,{
                error: "unauthenticated user 1!"
            });
        }
    } else {
        callback(404, {
            error: "invalid phone number !"
        })
    }
}

handler._users.post = (requestProperties, callback) => {

    const firstName = typeof (requestProperties.body.firstName) === "string" && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === "string" && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === "string" && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === "string" && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    const tosAgreements = typeof (requestProperties.body.tosAgreements) === "boolean" ? requestProperties.body.tosAgreements : false;

    if (firstName && lastName && phone && password && tosAgreements) {
        //make sure that user doesn't already exists
        lib.read('users', phone, (err, user) => {
            if (err && !user) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hashPassword(password),
                    tosAgreements
                }
                lib.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: "user created successfully"
                        })
                    } else {
                        callback(400, {
                            error: "failed to create user."
                        });
                    }
                })
            } else {
                callback(500, {
                    error: "user may already exists."
                })
            }
        })
    } else {
        callback(400, {
            error: "There is a problem in your request."
        })
    }
}
handler._users.put = (requestProperties, callback) => {

    const firstName = typeof (requestProperties.body.firstName) === "string" && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === "string" && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === "string" && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === "string" && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            lib.read('users', phone, (err, data) => {
                if (err) {
                    callback(404, {
                        error: "user not found !"
                    })
                } else {
                    const userData = parseJSON(data);
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = hashPassword(password);
                    }
                    lib.update("users", phone, userData, (err) => {
                        if (err) {
                            callback(400, {
                                error: "failed to update data !"
                            })
                        } else {
                            callback(200, {
                                message: "user updated successfully."
                            })
                        }
                    })
                }
            })
        } else {
            callback(500, {
                error: "Invalid request"
            })
        }
    } else {
        callback(400, {
            error: "Invalid phone number"
        })
    }

}
handler._users.delete = (requestProperties, callback) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === "string" && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        lib.read('users', phone, (err, u) => {
            const user = parseJSON(u);
            delete user.password;
            if (err && !u) {
                callback(404, {
                    error: "user not found"
                })
            } else {
                lib.delete("users", phone, (err) => {
                    if (err) {
                        callback(202, {
                            message: "delete successful"
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
            error: "Invalid phone number."
        })
    }
}


module.exports = handler;