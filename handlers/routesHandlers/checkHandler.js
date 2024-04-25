// dependencies 
const lib = require('../../lib/data');
const {parseJSON, createRandomString} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const {maxChecks} = require('../../helpers/environments');


// module scaffolding 
const handler = {};

handler.userHandler = (requestProperties, callback) => {
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

    const protocol = typeof (requestProperties.body.protocol) === "string" && ["http", "https"].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    const url = typeof (requestProperties.body.url) === "string" && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    const method = typeof (requestProperties.body.method) === "string" && ["get", "post", "put", "delete"].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    const successCode = typeof (requestProperties.body.successCode) === "object" && Array.isArray(requestProperties.body.successCode) === true ? requestProperties.body.successCode : false;

    const timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === "number" && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds > 0 && requestProperties.body.timeOutSeconds < 6 ? requestProperties.body.timeOutSeconds : false;

    if(protocol && url && method && successCode && timeOutSeconds){
        const tokenId = typeof (requestProperties.headers.tokenid) === "string" && requestProperties.headers.tokenid.trim().length === 20 ? requestProperties.headers.tokenid : false;

        if(tokenId){
            lib.read('tokens',tokenId,(error,token)=>{
                if(error){
                    callback(403,{
                        error: "unauthenticated user !"
                    }) 
                }else{
                    const phone = parseJSON(token).phone;
                    if(phone){
                        lib.read('users',phone,(error,user)=>{
                            if(error && !user){
                                callback(404,{
                                    error: "user not found !"
                                })
                            }else{
                                tokenHandler._token.verify(tokenId,user.phone,(verifiedUser)=>{
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
                                            lib.create('checks',checkId,checkObject,(error)=>{
                                                if(error){
                                                    callback(500,{
                                                        error: "there was a problem in server side."
                                                    });
                                                }else{
                                                    
                                                }
                                            })
                                        }else{
                                            callback(401,{
                                                error: "user has already reached max checks"
                                            })
                                        }
                                    }else{
                                        callback(403,{
                                            error: "unauthenticated user !"
                                        })
                                    }
                                })
                            }
                        })
                    }else{
                        callback(500,{
                            error : "there was a problem in server side !";
                        }) 
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
            error : "there was a problem in server side !";
        })
    }

}
handler._check.put = (requestProperties, callback) => {

}
handler._check.delete = (requestProperties, callback) => {

}


module.exports = handler;