import React, { Component } from "react";
import "./App.css";

import io from "socket.io-client";
const socket = io("http://localhost:3001");

const DataTable = ({ city, condition, weather }) => (
  <section>
    <h1> Temperature Details For "{city}" </h1>
    <div class="tbl-content">
      <table cellPadding="0" cellSpacing="0" border="0">
        <tbody>
          <tr>
            <td> Forecast Summary </td>
            <td> {condition.main} </td>
          </tr>
          <tr>
            <td> Forecast Details </td>
            <td> {condition.description} </td>
          </tr>
          <tr>
            <td> Temperature </td>
            <td>
              {(weather.temp - 273.15).toFixed(2)+' '}
              <sup>o</sup>
              C
            </td>
          </tr>
          <tr>
            <td> Humidity </td>
            <td> {weather.humidity}% </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);

class App extends Component {
  constructor() {
    super();

    socket.on("connection-response", data => {
      if (data) {
        this.setState({ connectionStatus: "Connection Established" });
      }
    });

    socket.on("temperature-data", weatherData => {
      this.setState({ weatherData });
    });

    this.state = {
      connectionStatus: "Connection Not Established.",
      weatherData: {
        city: null,
        condition: null,
        weather: null
      }
    };
  }
  render() {
    const { city, condition, weather } = this.state.weatherData;
    return (
      <div className="App">
        <header className="App-header">
          <img
            src={require("./assets/logo2.png")}
            className="App-logo"
            alt="logo"
          />
          <h1 className="App-title">
            Ask Google "What's the weather in Pune?"
          </h1>
        </header>
        <p className="App-intro">{this.state.connectionStatus}</p>
        {city !== null ? (
          <DataTable city={city} condition={condition} weather={weather} />
        ) : null}
      </div>
    );
  }
}

export default App;
