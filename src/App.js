import React, {useState, useEffect, useRef} from 'react'
import './App.scss';
import logo from './images/my-palette-logo.png'
import loader from './images/loader.gif'

//fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'

import Upload from './upload/Upload'
import ProgressBar from './progress-bar/progress-bar'

import { convertImgData } from './quantize/convert-file'
import { quantize } from './quantize/quantize'
import { createPalette } from './quantize/createPalette'

// import firebase from "firebase/app"
// import "firebase/firestore"
// import "firebase/auth"


// var firebaseConfig = {
//   apiKey: "AIzaSyABf049OMv97N0iYXVLpkVcG3NA6lHDmX0",
//   authDomain: "my-palette-c7674.firebaseapp.com",
//   projectId: "my-palette-c7674",
//   storageBucket: "my-palette-c7674.appspot.com",
//   messagingSenderId: "798082696291",
//   appId: "1:798082696291:web:a221aa6c6ce0585056e456",
//   measurementId: "G-E1YT48C4Y3"
// }

// firebase.initializeApp(firebaseConfig)
// firebase.analytics()


// fontawesome library adds
library.add(faFileUpload)

const loadingNotes = [
  'Finalizing your palette...',
  'Doing some hard math...',
  'Consulting Bob Ross...',
  'Not much longer now...',
  'It must be ready soon...',
  'Wrangling the colors for your palette...',
  'Figuring this one out...',
  'What is color, anyway...',
  "Whew, there's a lot of colors to go through here..."
]

const App = () => {

  const [fileObj, setFileObj] = useState({})
  const [progressBarProgress, setProgress] = useState(0)
  const [isQuantizing, setIsQuantizing] = useState(false);
  const [isBuildingPalette, setIsBuildingPalette] = useState(false)
  const [isFinalizingPalette, setIsFinalizingPalette] = useState(false)
  const [isComplete, setIsComplete] = useState(false);
  const [finalPaletteObj, setFinalPaletteObj] = useState({})

  const fileObjRef = useRef({})
  const currProgressRef = useRef(0)

  useEffect(() => {fileObjRef.current = fileObj}, [fileObj])
  useEffect(() => {currProgressRef.current = progressBarProgress}, [progressBarProgress])


  const collectFile = async (file) => {
    // convert file object to individual r, g, and b pixel data array
    setFileObj(file)
    let imgData = await convertImgData(file)

    setIsQuantizing(true)
    quantize(imgData, progressListener)
  }

  const progressListener = (newProgress) => {
    if(typeof newProgress !== 'number') {
      const rawPaletteData = {rawPalette: newProgress, file: fileObjRef.current}
      createPalette(rawPaletteData).then(e => {
        setIsComplete(true)
        setIsQuantizing(false)
        setIsFinalizingPalette(false)
        setFinalPaletteObj(e)
      })
    } else {
      if(!isBuildingPalette) setIsBuildingPalette(true)
      if(newProgress === 100) {
        setIsFinalizingPalette(true)
      }
  
      const currProgress = currProgressRef.current
      const updatedProgress = Math.round((newProgress * 100) / 100)
  
      if(updatedProgress === 100) {
        setIsBuildingPalette(false)
        setProgress(0)
      } else if (updatedProgress > currProgress) {
        setProgress(updatedProgress)
      }
    }
  }
  
  return (
    <>
      <div className="container">
        <div className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="/#">
              <img alt="my palette logo" src={logo}/>
              <p className="logo">&nbsp;My Palette</p>
            </a>
          </div>
        </div>
      </div>
      <div className="section is-medium">
        <div className="container">
          <section className='file-uploader content box'>
            {!isQuantizing && !isComplete && <Upload collectFile={collectFile}/>}
            {isQuantizing && !isBuildingPalette && !isComplete && (
              <>
                <p>
                  {isFinalizingPalette ? loadingNotes[Math.floor(Math.random() * loadingNotes.length)] : 'Preparing your image...'}
                </p>
                <img alt="loader spinner" src={loader} />
              </>
            )}
            {isQuantizing && isBuildingPalette && !isComplete && (
              <ProgressBar phase={'isCollectingPixelData'} progress={progressBarProgress} />
            )}
            {isComplete && !isQuantizing && (
              <>
                <img width="400px" alt='Your original upload with your palette!' src={finalPaletteObj.paletteCanvas} />
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default App;
