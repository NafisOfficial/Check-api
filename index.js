// Project Name : Check up/down api
// Description: RESTfull api
// Author : Md. Nafis Iqbal
// Type : Ideal Server Creation using raw node

const http = require("http");
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');

const app = {};


app.createServer = () => {
  const server = http.createServer(handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Server is running on port ${environment.port} && mode : ${environment.envName}`);
  });
};



app.createServer();
