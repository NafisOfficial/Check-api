/*-----------------------------
Description: CRUD
Author: Md. Nafis Iqbal,
Date: 07/04/2024,
email: nafisiqbal.net2002@gmail.ocm
------------------------------*/

// Dependencies
const lib = require('../../lib/data');
const { parseJSON } = require('../../helpers/utilities')


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
    
}

handler._token.post = (requestProperties, callback) => {

}

handler._token.put = (requestProperties, callback) => {

}

handler._token.delete = (requestProperties, callback) => {
   
}


module.exports = handler;