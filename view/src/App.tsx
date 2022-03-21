import { useState, useEffect, FormEvent } from 'react';
import { GoogleLogin } from 'react-google-login';
import ChatWrapper from './components/chat/ChatWrapper';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ResponseGoogle from './components/googleRegistration';


const client = new W3CWebSocket('ws://127.0.0.1:8000')

const getInputValue = (e: FormEvent) => (e.target as HTMLTextAreaElement).value;

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const stateSetter = (state: string, data: string) => {
    switch (state) {
      case 'username':
        setUsername(data);
        break;

      case 'password':
        setPassword(data);
        break;
    }
  }

  const submitUserData = async (event: any) => {
    event.preventDefault();

    const registerResponse = await fetch('http://localhost:3001/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': username,
        'password': password
      })
    });

    if (registerResponse.status === 200 && registerResponse.ok) {
      client.send(JSON.stringify({
        type: "message",
        userWhoSent: username,
        msg: username + ' joined the chat.'
      }));
      window.location.href = `http://localhost:3000/public-chat?username=${username}`;
    }
  }

  return (
    <form className='form loginForm'>
      <label>Username</label>
      <input type='text' name='username' onInput={(event) => stateSetter('username', getInputValue(event))} />

      <label>Password</label>
      <input type='password' name='password' onInput={(event) => stateSetter('password', getInputValue(event))} />

      <br />
      <input type='submit' value='Login' onClick={(e) => submitUserData(e)} />
    </form>
  );
}

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const stateSetter = (state: string, data: string) => {
    switch (state) {
      case 'firstName':
        setFirstName(data);
        break;

      case 'lastName':
        setLastName(data);
        break;

      case 'username':
        setUsername(data);
        break;

      case 'password':
        setPassword(data);
        break;
    }
  }

  const submitUserData = async (event: any) => {
    event.preventDefault();

    const isFormValid = [firstName, lastName, username, password].every((value: string) => value.length > 0);
    console.log('isFormValid', isFormValid)
    let isUsernameAlreadyUsed = false;

    await fetch('http://localhost:3001/users')
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          if (username.trim().toLowerCase() === data[i].username.trim().toLowerCase()) {
            isUsernameAlreadyUsed = true;
          }
        }
      });

    if (isUsernameAlreadyUsed) {
      console.log("username already used")
      return;
    }

    if (isFormValid) {
      const registerResponse = await fetch('http://localhost:3001/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'firstName': firstName,
          'lastName': lastName,
          'username': username,
          'password': password
        })
      });

      console.log(registerResponse, registerResponse)
      if (registerResponse.status === 201 && registerResponse.ok)
        window.location.href = `http://localhost:3000/public-chat?username=${username}`;
    } else {
      console.log("Something went wrong :(")
      return;
    }
  }

  return (
    <form className='form registerForm'>
      <label>First name</label>
      <input type='text' name='firstName' onInput={(event) => stateSetter('firstName', getInputValue(event))} />

      <label>Last name</label>
      <input type='text' name='lastName' onInput={(event) => stateSetter('lastName', getInputValue(event))} />

      <label>Username</label>
      <input type='text' name='username' onInput={(event) => stateSetter('username', getInputValue(event))} />

      <label>Password</label>
      <input type='password' name='password' onInput={(event) => stateSetter('password', getInputValue(event))} />

      <br />
      <input type='submit' value='Register' onClick={(e) => submitUserData(e)} />
    </form>
  );
}

const LoginPage = (props: { googleClientId: string }) => {
  const [loginOrRegister, setLoginOrRegister] = useState('register');
  if (props.googleClientId === '') return null;

  return (
    <div className='register'>
      <div className='registerOrLogin'>
        <h3 onClick={() => setLoginOrRegister('register')} className='registerOrLogin'>Register</h3>
        <h3>/</h3>
        <h3 onClick={() => setLoginOrRegister('login')} className='registerOrLogin'>Login</h3>
      </div>
      {loginOrRegister === 'register' ? <RegisterForm /> : <LoginForm />}

      <h3>or</h3>
      <GoogleLogin
        clientId={props.googleClientId}
        buttonText="Log in with Google"
        onSuccess={ResponseGoogle}
        onFailure={ResponseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
}


function App() {
  const [googleClientID, setGoogleClientID] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/app-params')
      .then(response => response.json())
      .then(result => setGoogleClientID(result.GoogleClientID))
      .catch(err => console.log(err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='login' />} />
        <Route path='/public-chat' element={<ChatWrapper />} />
        <Route path='/login' element={<LoginPage googleClientId={googleClientID} />} />
      </Routes>
    </Router>
  );
}

export default App;