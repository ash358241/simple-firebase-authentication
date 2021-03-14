import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useState } from "react";

// firebase.initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    newUser: false,
    name: "",
    email: "",
    password: "",
    photo: "",
    error: "",
    success: false, 
  });

  const GoogleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();


  //signIn btn
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(GoogleProvider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        // console.log(displayName, photoURL, email);
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  //signOut button
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signedOutUser = {
          isSignedIn: false,
          name: " ",
          email: " ",
          photo: " ",
        };
        setUser(signedOutUser);
      })
      .catch((err) => {});
  };

  //formSubmit
  const handleSubmit = (e) => {
    console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          // Signed in
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    if (!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const newUserInfo = { ...user };
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    console.log('Sign in user info', res.user);
  })
  .catch((error) => {
    const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
  });
    }
    e.preventDefault();
  };


  //update user
  const updateUserName = name =>{
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function() {
      console.log('User name is updated successfully');
    }).catch(function(error) {
      console.log(error);
});
  }

  //onBlur
  const handleBlur = (e) => {
    let isSymbolValid = true;
    if (e.target.name === "email") {
      isSymbolValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPassValid = e.target.value.length > 6;
      const isPassHasNum = /\d{1}/.test(e.target.value);
      isSymbolValid = isPassValid && isPassHasNum;
    }
    if (isSymbolValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };


  //FBSignIn 
  const handleFBSignIn = () => {
    firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log('fb user after sign in', user);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }

  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign-Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign-In</button>
      )}
      <br/>
      <button onClick={handleFBSignIn}>Sign in using facebook</button>
      {user.isSignedIn && (
        <div>
          <p>welcome {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}

      <h1>our own authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New user sign up</label>
      {/* <p>name: {user.name}</p>
      <p>email: {user.email}</p>
      <p>password: {user.password}</p> */}
      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Name" />}
        <br />
        <input
          type="text"
          name="email"
          onBlur={handleBlur}
          placeholder="Email"
        />
        <br />
        <input
          type="password"
          name="password"
          onBlur={handleBlur}
          placeholder="Password"
        />
        <br />
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      <p style={{ color: "red" }}>{user.error}</p>
      {
        user.success && <p style={{ color: "Green" }}>User {newUser ? 'created' :'logged in'} successfully</p>

      }
    </div>
  );
}

export default App;
