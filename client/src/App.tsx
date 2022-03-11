import React, { useState, useEffect, useContext } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { nanoid } from 'nanoid';
import { GoogleLogin } from 'react-google-login';
import './App.css';


const client = new W3CWebSocket('ws://127.0.0.1:8000')

const responseGoogle = (response: any) => {
  if (response.hasOwnProperty('error')) {
    console.log(response);
    throw new Error("Something went wrong during Google authentication");
  }
  console.log(response);

  const firstName = response.Du.VX;
  const lastName = response.Du.iW;
  const tokenId = response.tokenId;
  const profilePicURL = response.profileObj.imageUrl;
  const email = response.profileObj.email;

  fetch('http://localhost:3001/api/google-login', {
    method: 'POST',
    
    body: JSON.stringify({
      "firstName": firstName,
      "lastName": lastName,
      "tokenID": tokenId,
      "profilePicUrl": profilePicURL,
      "email": email
    }),

    headers: {
      'Content-Type': 'application/json'
    }
  });
}

interface MessageInterface {
  type?: string,
  userWhoSent: string,
  msg: string
}

const RegisterOrLogin = (props: { action: string }) => {
  if (props.action === 'register') {

  }
}

const LoginPage = (props: { isUserLoggedIn: boolean, googleClientId: string }) => {

  if (props.isUserLoggedIn) {
    return null;
  }

  return(
    <div className='register'>
      <h3>Register / Login</h3>
      <input type='text' placeholder='Enter username' />
      <h3>or</h3>
      <GoogleLogin
        clientId={props.googleClientId}
        buttonText="Log in with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
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
  const [googleClientID, setGoogleClientID] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/app-params')
    .then(response => response.json())
    .then(result => setGoogleClientID(result.GoogleClientID));
  }, []);

  return googleClientID !== '' ? <LoginPage isUserLoggedIn={isLoggedIn} googleClientId={googleClientID} /> : null;
}

export default App;