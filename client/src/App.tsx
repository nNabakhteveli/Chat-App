import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './App.css';

const client = new W3CWebSocket('ws://127.0.0.1:8000')


function App() {
  const [messages, setMessages] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {

    client.onopen = () => {
      console.log("Connected to WebSocket successfuly")
    }

    client.onmessage = (msg: any) => {
      const dataFromServer = JSON.parse(msg.data);
      console.log(dataFromServer)
    }
  }, []);

  const sendMessage = (value: string): void => {
    client.send(JSON.stringify({
      type: "message",
      msg: value
    }));
  }

  return (
    <div className="App">
      <h1>Hello world!</h1>
      <button onClick={() => sendMessage("Hello from React!")}>Send message</button>
    </div>
  );
}

export default App;

