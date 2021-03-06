// pixel array worker function converts image data array into an array of objects representing individual rgb pixel groups.
onmessage = function(e) {
    // Spawn subworker for the median cut function
    // const paletteWorker = new Worker('./build-palette-recursive.js')

    // spawn subworker for k-means
    // const kMeansWorker = new Worker('./k-means.js')

    let pixelArray = []
    let pixelObj = {}
    let progress = 0
    
    const rgbArray = e.data
    let j = 0;
  
    for (const i in rgbArray) {
      if (i % 4 === 0 || i === 0) {
        pixelObj.r = rgbArray[i]
      } else if (i % 4 === 1) {
        pixelObj.g = rgbArray[i]
      } else if (i % 4 === 2) {
        pixelObj.b = rgbArray[i]
        pixelArray.push(pixelObj)
      } else if (i % 4 === 3) {
        pixelObj = {}
        j++
        if (j%50000 === 0 || i === (rgbArray.length - 1)) {
          // update progress variable, send while this loop runs
          // this function makes up 50% of total progress, build palette the other 50%
          progress = ((i/rgbArray.length)*100)
          postMessage(progress)
        }
      }
    }

    postMessage(100)
    postMessage(pixelArray)

    // k-mean subworker calls
    // kMeansWorker.postMessage({pixelArray, k: 5})
    // kMeansWorker.onmessage = e => {
    //   console.log(e.data)
    //   // if (typeof e.data === 'number') {
    //   //   progress = 50 + (e.data)
    //   //   postMessage(progress)
    //   // } else {
    //   //   postMessage(100)
    //   //   const quantizedPixelArray = e.data
    //   //   kMeansWorker.terminate()
    //   // }
    // }

    // call subworker that was spawned previously
    // paletteWorker.postMessage({pixelArray, currDepth: 0, maxDepth: 3})

    // paletteWorker.onmessage = e => {
    //   if (typeof e.data === 'number') {
    //     progress = 50 + (e.data/2)
    //     postMessage(progress)
    //   } else {
    //     postMessage(100)
    //     const rawPalette = e.data
    //     postMessage(rawPalette)
    //     paletteWorker.terminate()
    //   }
    // }
  }