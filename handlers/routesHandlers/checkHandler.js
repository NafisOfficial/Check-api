// dependencies 
const lib = require('../../lib/data');
const {parseJSON, createRandomString} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const {maxChecks} = require('../../helpers/environments');


// module scaffolding 
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];

    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback)
    } else {
        callback(405, {
            error: "method not allowed !"
        })
    }


}

handler._check = {};

handler._check.get = (requestProperties, callback) => {

}

handler._check.post = (requestProperties, callback) => {
    //valided all parameters
    const protocol = typeof (requestProperties.body.protocol) === "string" && ["http", "https"].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    const url = typeof (requestProperties.body.url) === "string" && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    const method = typeof (requestProperties.body.method) === "string" && ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method.toUpperCase()) > -1 ? requestProperties.body.method : false;

    const successCode = typeof (requestProperties.body.successCode) === "object" && Array.isArray(requestProperties.body.successCode) === true ? requestProperties.body.successCode : false;

    const timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === "number" && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds > 0 && requestProperties.body.timeOutSeconds < 6 ? requestProperties.body.timeOutSeconds : false;

    // valid all parameters comes true
    if(protocol && url && method && successCode && timeOutSeconds){
        //get the tokenid from header
        const tokenId = typeof (requestProperties.headers.tokenid) === "string" && requestProperties.headers.tokenid.trim().length === 20 ? requestProperties.headers.tokenid : false;
        if(tokenId){
            //read the tokens from tokens folder
            lib.read('tokens',tokenId,(error,token)=>{
                if(error && !token){
                    callback(403,{
                        error: "unauthenticated user 2!"
                    }) 
                }else{
                    // get phone number from tokens
                    const phone = parseJSON(token).phone;
                    if(phone){
                        // get related user from users folder using phone numbers of tokens
                        lib.read('users',phone,(error,user)=>{
                            if(error && !user){
                                callback(404,{
                                    error: "user not found !"
                                })
                            }else{
                                // verify the corresponding tokenid and phone number
                                const userPhone = parseJSON(user).phone
                                tokenHandler._token.verify(tokenId,userPhone,(verifiedUser)=>{
                                    if(verifiedUser){
                                        const userObject = parseJSON(user);
                                        const userChecks = typeof(userObject.checks) === "object" && userObject.checks instanceof Array ? userObject.checks : [];
                                        if(userChecks.length < maxChecks){
                                            checkId = createRandomString(20);
                                            const checkObject = {
                                                id: checkId,
                                                userPhone: phone,
                                                protocol,
                                                url,
                                                method,
                                                successCode,
                                                timeOutSeconds
                                            }
                                            //create checks in checks folder
                                            lib.create('checks',checkId,checkObject,(error)=>{
                                                if(error){
                                                    callback(500,{
                                                        error: "there was a problem in server side."
                                                    });
                                                }else{
                                                    //update the new users data
                                                    userObject.checks = userChecks;
                                                    userObject.checks.push(checkId);
                                                    lib.update('users',phone,userObject,(error)=>{
                                                        if(error){
                                                            callback(500,{
                                                                error: "there was problem in server side."
                                                            })
                                                        }else{
                                                            callback(200,checkObject);
                                                        }
                                                    })

                                                }
                                            })
                                        }else{
                                            callback(401,{
                                                error: "user has already reached max checks"
                                            })
                                        }
                                    }else{
                                        callback(403,{
                                            error: "unauthenticated user 1!"
                                        })
                                    }
                                })
                            }
                        })
                    }else{
                        callback(500,{
                            error : "there was a problem in server side !"
                        });
                    }
                }
            })
        }else{
            callback(403,{
                error: "unauthenticated user !"
            })
        }
    }else{
        callback(500,{
            error : "there was a problem in server side !"
        })
    }

}
handler._check.put = (requestProperties, callback) => {

}
handler._check.delete = (requestProperties, callback) => {

}


module.exports = handler;