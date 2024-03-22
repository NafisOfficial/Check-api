// Ideal Server Structure Using Raw node:

const http = require("http");
const { start } = require("repl");

// app object - module scaffolding
const app = {};

// configuration
app.config = {
  port: 3000,
};

//create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Server is running on port ${app.config.port}`);
  });
};

// handle req/res
app.handleReqRes = (req, res) => {
  // response handle
  res.end("Hello World");
};

//start server
app.createServer();
