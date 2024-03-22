// Project Name : Check up/down api
// Description: RESTfull api
// Author : Md. Nafis Iqbal
// Type : Ideal Server Creation using raw node

const http = require("http");

const app = {};

app.config = {
  port: 3000,
};

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Server is running on port ${app.config.port}`);
  });
};

app.handleReqRes = (req, res) => {
  res.end("Hello World");
};

app.createServer();
