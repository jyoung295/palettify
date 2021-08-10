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

const firebaseConfig = {
  apiKey: "AIzaSyBounGH3RV6QDuoib_h77mZ17NTyqGIzdg",
  authDomain: "palettify-me.firebaseapp.com",
  projectId: "palettify-me",
  storageBucket: "palettify-me.appspot.com",
  messagingSenderId: "541069334271",
  appId: "1:541069334271:web:098fdc41f85df350285eca",
  measurementId: "G-56TEQPEH74"
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

const App = () => {
  
  return (
    <>
      <div className="container">
        <div className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="/#">
              <img alt="my palette logo" src={logo}/>
              <p className="logo">&nbsp;Palettify</p>
            </a>
          </div>
        </div>
      </div>

      <PaletteBuilder />

    </>
  );
}

export default App;
