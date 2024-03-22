const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../Routes');
const notFoundHandler= require('../handlers/routesHandlers/notFoundHandler')


const handler = {};

handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url,true);
    const path = parsedUrl.pathname;
    const trimedPath = path.replace(/^\/+|\/+$/g,'');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headers = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimedPath,
        method,
        queryStringObject,
        headers
    }

    const chosenHandler = routes[trimedPath] ? routes[trimedPath] : notFoundHandler;

    // todos:: set status code and payload

    chosenHandler(requestProperties,(statusCode,payload)=>{

    });

    const decoder = new StringDecoder('utf-8');
    let realData = '';
    req.on('data',(buffer)=>{
     realData += decoder.write(buffer);
    });
    req.on('end',()=>{
     realData += decoder.end();
     res.end(realData)
    })
    
 };

module.exports = handler;