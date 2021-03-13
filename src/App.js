import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';


firebase.initializeApp(firebaseConfig);

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig); 
}

function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: ' ',
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
    </div>
  );
}

export default App;
