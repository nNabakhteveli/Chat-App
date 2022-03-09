import React, { useState, useEffect, useContext } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { nanoid } from 'nanoid';
import './App.css';

const LoginContext = React.createContext<boolean | null>(null);

const client = new W3CWebSocket('ws://127.0.0.1:8000')

interface MessageInterface {
  type?: string,
  userWhoSent: string,
  msg: string
}


const LoginPage = (props: { isUserLoggedIn: boolean }) => {

  if (props.isUserLoggedIn) {
    return null;
  } else {
    return(
      <div className='continueWithoutLoginContainer'>
        <h3>Continue without login</h3>
        <input type='text' placeholder='Enter username' />
        <h3>or</h3>
      </div>
    );
  }
}

const DisplayMessages = (props: { messagesData: MessageInterface[] }) => {
  return(
    <div className='chatContainer'>
        {
          props.messagesData.length > 0 ? props.messagesData.map(({ userWhoSent, msg }: MessageInterface) => <h3 key={nanoid()}>{userWhoSent}: {msg}</h3>) : null
        } 
    </div>
  );
}

function ChatContainer() {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState('');


  useEffect(() => {
    client.onopen = () => {
      console.log("Connected to WebSocket successfuly")
    }

    client.onmessage = (msg: any) => {
      const dataFromServer = JSON.parse(msg.data);

      const obj: MessageInterface = {
        type: dataFromServer.type,
        userWhoSent: dataFromServer.userWhoSent,
        msg: dataFromServer.msg
      };

      if (dataFromServer.recentMessages.length === 0) {
        const arr: Array<MessageInterface> = messages.concat(obj);
        setMessages(arr);
      } else {
        const arr: Array<MessageInterface> = messages.concat(...dataFromServer.recentMessages, obj);
        setMessages(arr)
      }
    }

    const temporaryUsername = prompt('Enter your username: ');

    setUsername(typeof temporaryUsername === 'string' ? temporaryUsername : '');
  }, []);
  
  const sendMessage = (value: string): void => {
    if (value.length === 0) {
      return;
    }

    client.send(JSON.stringify({
      recentMessages: messages,
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
      <DisplayMessages messagesData={messages} />
      <input type='text' className="messageInput" onChange={(event) => getValueFromInputField(event)} />
      <br />
      <button onClick={() => sendMessage(inputValue)}>Send message</button>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <LoginPage isUserLoggedIn={isLoggedIn} />
}

export default App;