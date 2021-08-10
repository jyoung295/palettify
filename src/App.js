import React, {useState, useEffect, useRef} from 'react'
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/analytics'

import './App.scss';
import logo from './images/palettify-logo.png'

import PaletteBuilder from './palette-builder/palette-builder'
import Login from './login/Login'

const firebaseConfig = {
  apiKey: "AIzaSyBounGH3RV6QDuoib_h77mZ17NTyqGIzdg",
  authDomain: "palettify-me.firebaseapp.com",
  projectId: "palettify-me",
  storageBucket: "palettify-me.appspot.com",
  messagingSenderId: "541069334271",
  appId: "1:541069334271:web:098fdc41f85df350285eca",
  measurementId: "G-56TEQPEH74"
}

// firebase.initializeApp(firebaseConfig)
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
firebase.analytics()

const App = () => {
  
  return (
    <Router>
      <div className="container">
        <div className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">
              <img alt="my palette logo" src={logo}/>
              <p className="logo">&nbsp;Palettify</p>
            </Link>
          </div>
          <div className="navbar-end">
            <Link className="navbar-item" to="/login">Log in</Link>
          </div>
        </div>
      </div>

      <Switch>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/">
          <PaletteBuilder />
        </Route>
        
      </Switch>

    </Router>
  );
}

export default App;
