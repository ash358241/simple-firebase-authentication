import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';


// firebase.initializeApp(firebaseConfig);

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig); 
}

function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: ' ',
    password: ' ',
    photo: ' '
  });

  const provider = new firebase.auth.GoogleAuthProvider();

  //signIn btn
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      // console.log(displayName, photoURL, email);
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser)
    })
    .catch(err => {
      console.log(err)
      console.log(err.message)
    })
  }


  //signOut button
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: ' ',
        email: ' ',
        photo: ' '
      }
      setUser(signedOutUser);
    })
    .catch(err => {

    })
  }

  //formSubmit 
  const handleSubmit = () => {

  }

  //onBlur 
  const handleBlur = (e) => {
    let isFormValid = true;
    if(e.target.name === 'email'){
     isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPassValid = e.target.value.length > 6;
      const isPassHasNum = /\d{1}/.test(e.target.value);
      isFormValid = (isPassValid && isPassHasNum);
    }
    if(isFormValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign-Out</button> : 
        <button onClick={handleSignIn}>Sign-In</button>

      }
      {
        user.isSignedIn && <div>
          <p>welcome {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }


      <h1>our own authentication</h1>
      <p>name: {user.name}</p>
      <p>email: {user.email}</p>
      <p>password: {user.password}</p>
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" onBlur={handleBlur} placeholder="Name" />
        <br/>
      <input type="text" name="email" onBlur={handleBlur} placeholder="Email" />
      <br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Password" />
      <br/>
      <input type="submit" value="Submit"/>
      </form>

    </div>
  );
}

export default App;
