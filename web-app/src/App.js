import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import io from "socket.io-client";
const socket = io("http://localhost:3001");

class App extends Component {
  constructor() {
    super();

    socket.on("connection-response", data => {
      this.setState({ message: JSON.stringify(data) });
    });

    socket.on("message", data => {
      this.setState({ message: data });
    });

    this.state = {
      message: "nothing"
    };
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">Message: {this.state.message}</p>
      </div>
    );
  }
}

export default App;
