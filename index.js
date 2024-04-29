// Project Name : Check up/down api
// Description: RESTfull api
// Author : Md. Nafis Iqbal
// Type : Ideal Server Creation using raw node


//dependencies
const server = require('./lib/server');
const worker = require('./lib/worker');

//module scaffolding
const app = {};


app.init = () => {
    // start the server
    server.init();
    //start the worker
    worker.init();
}

app.init();

//export the app
module.exports = app;