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

const App = () => {

  const [fileObj, setFileObj] = useState({})
  const [progressBarProgress, setProgress] = useState(0)
  const [isQuantizing, setIsQuantizing] = useState(false);
  const [isBuildingPalette, setIsBuildingPalette] = useState(false)
  const [isFinalizingPalette, setIsFinalizingPalette] = useState(false)
  const [isComplete, setIsComplete] = useState(false);
  const [finalPaletteObj, setFinalPaletteObj] = useState({})

  const fileObjRef = useRef({})

  useEffect(() => {fileObjRef.current = fileObj}, [fileObj]);


  const collectFile = async (file) => {
    // convert file object to individual r, g, and b pixel data array
    setFileObj(file)
    let imgData = await convertImgData(file)

    setIsQuantizing(true)
    quantize(imgData, progressListener)
  }

  const progressListener = (newProgress) => {
    if(typeof newProgress !== 'number') {
      setIsFinalizingPalette(true)
      const rawPaletteData = {rawPalette: newProgress, file: fileObjRef.current}
      const finalPaletteData = createPalette(rawPaletteData).then(e => {
        console.log(e)
      })
      // TODO: continue process
    } else {
      if(!isBuildingPalette) setIsBuildingPalette(true)
  
      const currProgress = progressBarProgress
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
            {!isQuantizing && <Upload collectFile={collectFile}/>}
            {isQuantizing && !isBuildingPalette && !isComplete && (
              <>
                <p>
                  {isFinalizingPalette ? 'Finalizing your palette...' : 'Preparing your image...'}
                </p>
                <img alt="loader spinner" src={loader} />
              </>
            )}
            {isQuantizing && isBuildingPalette && !isComplete && (
              <ProgressBar phase={'isCollectingPixelData'} progress={progressBarProgress} />
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default App;
