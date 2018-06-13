const expressApp = require("express")();
const bodyParser = require("body-parser");
const server = require("http").Server(expressApp);
const fetch = require("node-fetch");

const io = require("socket.io")(server);

const { dialogflow } = require("actions-on-google");

// socket instance holder
let singleSocket;

// Open Weather URL
const apiKey = require("./config").owAPIKey;
const openWeatherURL = `http://api.openweathermap.org/data/2.5/weather?appid=${apiKey}`;

// Create an dialogflow app instance
const dialogflowApp = dialogflow();
expressApp.use(bodyParser.json(), dialogflowApp);

// Register handlers for Dialogflow intents

dialogflowApp.intent("Default Welcome Intent", conv => {
  conv.ask("Hey, hello there. Try asking weather in Pune.");
});

// Intent in Dialogflow called `AskTemperature`
dialogflowApp.intent("AskTemperature", async (conv, { city, country }) => {
  const location = city ? city : country;
  const response = await fetch(`${openWeatherURL}&q=${location}`);
  const data = await response.json();
  const { weather, main } = data;
  const messageToSend = {
    city: location,
    condition: weather[0],
    weather: main
  };

  singleSocket.emit("temperature-data", messageToSend);

  conv.ask(
    `Weather in ${location} is ${(main.temp - 273.15).toFixed(
      2
    )} degree celsius.`
  );
});

io.on("connection", function(socket) {
  singleSocket = socket;
  socket.emit("connection-response", { isConnected: true });
  console.log("Connection Established");
});

server.listen(3001, () => {
  console.log("Listening on 3001");
});
