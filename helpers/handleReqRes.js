
// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../Routes');
const notFoundHandler = require('../handlers/routesHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimedPath = path.replace(/^\/+|\/+$/g, '');
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

    const chosenHandler = routes[trimedPath] ? routes[trimedPath] : notFoundHandler.notFound;


    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });


    req.on('end', () => {

        realData += decoder.end();
        requestProperties.body = parseJSON(realData);
        chosenHandler(requestProperties, (statusCode, payload) => {

            statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
            payload = typeof (payload) === 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });

};

module.exports = handler;