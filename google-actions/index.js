const expressApp = require("express")();
const bodyParser = require("body-parser");
const server = require("http").Server(expressApp);

const io = require("socket.io")(server);

const { dialogflow } = require("actions-on-google");

// socket instance holder
let singleSocket;

// Create an dialogflow app instance
const dialogflowApp = dialogflow();
expressApp.use(bodyParser.json(), dialogflowApp);

// Register handlers for Dialogflow intents

dialogflowApp.intent("Default Welcome Intent", conv => {
  conv.ask("Hi, how is it going?");
});

// Intent in Dialogflow called `HelloWorld`
dialogflowApp.intent("HelloWorld", conv => {
  const messageToSend = `Raw Text: ${conv.input.raw}, Intent: ${conv.intent}`;
  singleSocket.emit("message", messageToSend);
  conv.ask("Hello Akshay");
});

io.on("connection", function(socket) {
  singleSocket = socket;
  socket.emit("connection-response", { isConnected: true });
  console.log("Connection Established");
});

server.listen(3001, () => {
  console.log("Listening on 3001");
});
