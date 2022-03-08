import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { nanoid } from 'nanoid';
import './App.css';


const client = new W3CWebSocket('ws://127.0.0.1:8000')

interface MessageInterface {
  type?: string,
  userWhoSent: string,
  msg: string
}

const ChatContainer = (props: { messagesData: MessageInterface[] }) => {
  return(
    <div className='chatContainer'>
        {
          props.messagesData.length > 0 ? props.messagesData.map(({ userWhoSent, msg }: MessageInterface) => <h3 key={nanoid()}>{userWhoSent}: {msg}</h3>) : null
        } 
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState('');


  useEffect(() => {
    client.onopen = () => {
      console.log("Connected to WebSocket successfuly")
    }

    client.onmessage = (msg: any) => {
      const dataFromServer = JSON.parse(msg.data);
      console.log(2, dataFromServer);

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
      <ChatContainer messagesData={messages} />
      <input type='text' className="messageInput" onChange={(event) => getValueFromInputField(event)} />
      <br />
      <button onClick={() => sendMessage(inputValue)}>Send message</button>
    </div>
  );
}

export default App;