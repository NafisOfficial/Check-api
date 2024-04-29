// tittle : server section
// Description: server initialization and start
// Author : Md. Nafis Iqbal
// Type : Ideal Server Creation using raw node

const http = require("http");
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');


const server = {};



server.createServer = () => {
  const createServerVariable = http.createServer(handleReqRes);
  createServerVariable.listen(environment.port, () => {
    console.log(`Server is running on port ${environment.port} && mode : ${environment.envName}`);
  });
};

server.init = () => {
  server.createServer();
};


//export the server
module.exports = server;
