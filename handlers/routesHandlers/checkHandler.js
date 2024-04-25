// dependencies 
const lib = require('../../lib/data');


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

}
handler._check.put = (requestProperties, callback) => {

}
handler._check.delete = (requestProperties, callback) => {

}


module.exports = handler;