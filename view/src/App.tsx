import { useState, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import ChatWrapper from './components/chat/ChatWrapper';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';


const responseGoogle = async (response: any) => {
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

  try {
    const postUser = await fetch('http://localhost:3001/api/google-login', {
      method: 'POST',

      body: JSON.stringify({
        "firstName": firstName,
        "lastName": lastName,
        "tokenID": tokenId,
        "profilePicURL": profilePicURL,
        "email": email
      }),

      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    await fetch(`http://localhost:3001/current-user?email=${email}`);
    if (postUser.ok) window.location.href = `http://localhost:3000/public-chat?firstName=${firstName}&lastName=${lastName}`;

  } catch (error) {
    console.log(error);
  }
}


const LoginPage = (props: { isUserLoggedIn: boolean, googleClientId: string }) => {
  if (props.googleClientId === '') return null;

  if (props.isUserLoggedIn) {
    window.location.href = 'http://localhost:3000/lobby';
    return null;
  }

  return (
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

/* 
  @TODO:
    1. Create routes(/lobby) with react-router and API for that routes
    2. Should also make registration/login from website
*/

const Lobby = () => {
  return <h2>hi</h2>
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        <Route path='/login' element={<LoginPage isUserLoggedIn={isLoggedIn} googleClientId={googleClientID} />} />
        <Route path='/lobby' element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;