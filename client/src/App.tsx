import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { nanoid } from 'nanoid';
import './App.css';


const client = new W3CWebSocket('ws://127.0.0.1:8000')


interface MessageInterface {
  userWhoSent: string,
  msg: string
}

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    client.onopen = () => {
      console.log("Connected to WebSocket successfuly")
    }

    client.onmessage = (msg: any) => {
      const dataFromServer = JSON.parse(msg.data);
      let arr: any = [...messages, dataFromServer];
      setMessages(arr);
    }

    const temporaryUsername = prompt('Enter your username: ');

    setUsername(typeof temporaryUsername === 'string' ? temporaryUsername : '');
  }, []);

  const sendMessage = (value: string): void => {
    client.send(JSON.stringify({
      type: "message",
      userWhoSent: username,
      msg: value
    }));
  }

  const getValueFromInputField = (event: any) => {
    setInputValue(event.target.value);
  }

  return (
    <div className="App">
      <h1>Hello world!</h1>
      <div className='chatContainer'>
        {
          messages.length > 0 ? messages.map(({ userWhoSent, msg }: MessageInterface)=> <h3 key={nanoid()}>{userWhoSent}: {msg}</h3>) : null
        } 
      </div>
      <input type='text' className="messageInput" onChange={(event) => getValueFromInputField(event)} />
      <br />
      <button onClick={() => sendMessage(inputValue)}>Send message</button>
    </div>
  );
}

export default App;