import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './App.css';

const client = new W3CWebSocket('ws://127.0.0.1:8000')

function App() {

  useEffect(() => {
    client.onopen = () => {
      console.log("Connected to WebSocket successfuly")
    }
  }, []);

  return (
    <div className="App">
      <h1>Hello world!</h1>
    </div>
  );
}

export default App;

