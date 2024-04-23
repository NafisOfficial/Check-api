
const { sampleHandler } = require('./handlers/routesHandlers/routesHandlers');
const { userHandler } = require('./handlers/routesHandlers/userHandler');
const { tokenHandler } = require('./handlers/routesHandlers/tokenHandler');


const routes = {
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler
}

module.exports = routes;