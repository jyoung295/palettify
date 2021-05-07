import React, {useState, useEffect, useRef} from 'react'

import './App.scss';
import logo from './images/palettify-logo.png'
import loader from './images/loader.gif'

import Upload from './upload/Upload'
import ProgressBar from './progress-bar/progress-bar'

import { convertImgData } from './quantize/convert-file'
import { quantize } from './quantize/quantize'
import { createPalette } from './quantize/createPalette'
import PaletteDisplay from './palette-display/palette-display';

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
    setFileObj(file)
    let imgData = await convertImgData(file)

    setIsQuantizing(true)
    quantize(imgData, progressListener)
  }

  const progressListener = (newProgress) => {
    if(typeof newProgress !== 'number') {
      const rawPaletteData = {rawPalette: newProgress, file: fileObjRef.current}
      createPalette(rawPaletteData).then(e => {
        setFinalPaletteObj(e)
        setIsComplete(true)
        setIsQuantizing(false)
        setIsFinalizingPalette(false)
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

  const restart = () => {
    setFileObj({})
    setFinalPaletteObj({})
    setProgress(0)
    setIsComplete(false)
  }
  
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
      <div className="section">
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
            {isComplete && <PaletteDisplay paletteData={finalPaletteObj} restart={restart} />}
          </section>
        </div>
      </div>
    </>
  );
}

export default App;
