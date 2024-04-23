/*-----------------------------
Description: utilities function,
Author: Md. Nafis Iqbal,
Date: 07/04/2024
------------------------------*/

//dependencies
const crypto = require('crypto');
const environments = require('./environments');
//module scaffolding
const utilities = {};

// make json string to valid json
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        output = {};
    }
    return output;
}

// hash the password
utilities.hashPassword = (passwordString) => {
    if(typeof(passwordString)==='string' && passwordString.length>0){
        let hash = crypto.createHmac("sha256",environments.secretKey)
        .update(passwordString)
        .digest("hex")
        return hash;
    }else{
        return false;
    }
}

//create random string
utilities.createRandomString = (stringLength) => {
    let length = stringLength;
    const possiableCharacter = "abcdefghijklmnopqrstuvwxyz0123456789";
    let output = "";
    for(i=0;i<length;i++){
        const randomCharacter = possiableCharacter.charAt(Math.floor(Math.random() * possiableCharacter.length));
        output+=randomCharacter;
    }
    return output;
}


module.exports = utilities;