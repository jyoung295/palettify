var convert = require('color-convert');
// called from App.js to run the quanitzation process functions
export const quantize = async (imgData, progressListener) => {
  // ------ k-means ------
  // const quantizeParentWorker = new Worker('./workers/get-pixel-array.js')
  // quantizeParentWorker.postMessage(imgData)
  // quantizeParentWorker.onmessage = e => {
  //   if (typeof e.data === 'number') {
  //     progressListener(e.data)
  //   } else {
  //     progressListener(100)
  //     progressListener(e.data)
  //     quantizeParentWorker.terminate()
  //   }
  // }
  const kMeansWorker = new Worker('./workers/k-means.js')

  // ------ median cut ------
  const quantizeParentWorker = new Worker('./workers/get-pixel-array.js')

  quantizeParentWorker.postMessage(imgData)

  quantizeParentWorker.onmessage = e => {
    if (typeof e.data === 'number') {
      progressListener(e.data)
    } else {
      const labArray = convertToLab(e.data)
      quantizeParentWorker.terminate()
      kMeansWorker.postMessage({pixelArray: labArray, k: 8})
      kMeansWorker.onmessage = e => {
        if (typeof e.data === 'number') {
          console.log(e.data)
          progressListener(e.data)
        } else {
          const rgbCentroids = convertToRgb(e.data)
          console.log(rgbCentroids)
          progressListener(rgbCentroids)
          kMeansWorker.terminate()
        }
      }
    }
  }
}

const convertToLab = pixelArray => {
  let labArray = []
  pixelArray.forEach(pixel => {
    let labPixelArray = convert.rgb.lab(pixel.r, pixel.g, pixel.b)
    let labPixel = {r: labPixelArray[0], g: labPixelArray[1], b: labPixelArray[2]}
    labArray.push(labPixel)
  })
  return labArray
}

const convertToRgb = pixelArray => {
  let rgbArray = []
  pixelArray.forEach(pixel => {
    let rgbPixelArray = convert.lab.rgb(pixel.r, pixel.g, pixel.b)
    let rgbPixel = {r: rgbPixelArray[0], g: rgbPixelArray[1], b: rgbPixelArray[2]}
    rgbArray.push(rgbPixel)
  })
  return rgbArray
}