// pull the image data array from the photo
// convert that array into array of pixel objects

const getPixelArray = (e) => {
  let pixelArray = []
  let pixelObj = {}
  
  const rgbArray = e.data.imgData
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
      if (j%4000 === 0) {
        postMessage((i/rgbArray.length)*100)
      }
    }
  }
  postMessage(pixelArray)
}


// returns the swatch array
export const quantize = async (imgDataObj, pixelProgressListener, swatchProgressListener) => {
  let pixelArrayWorkerFunctionBlob = new Blob(["onmessage = " + getPixelArray.toString()], {type: "text/javascript"})
  const pixelArrayWorker = new Worker(URL.createObjectURL(pixelArrayWorkerFunctionBlob))

  pixelArrayWorker.postMessage(imgDataObj)

  pixelArrayWorker.onmessage = e => {
    if (typeof e.data === 'number') {
      pixelProgressListener(e.data)
    } else {
      pixelProgressListener(100)

      let swatchWorkerFunctionBlob = new Blob(["onmessage = " + buildSwatchRecursiveWorker.toString()], {type: "text/javascript"})
      const swatchWorker = new Worker(URL.createObjectURL(swatchWorkerFunctionBlob))

      swatchWorker.postMessage({pixelArray: e.data, currDepth: 0, maxDepth: 3})

      swatchWorker.onmessage = e => {
        console.log(e)
      }
    }
    // console.log(e)
  }


  // const swatch = buildSwatchRecursive(pixelArray, 0, 3)

  // console.log(pixelArray)
  // console.log(swatch)

  // // sort swatch by largest range
  // const sortColor = findLargeRange(swatch)
  // swatch.sort((color1, color2) => {
  //   return color1[sortColor] - color2[sortColor]
  // })
  // return { swatch, photo, name }
}

const buildSwatchRecursiveWorker = (e) => {
  
  const buildSwatchRecursive = (e) => {
    let {pixelArray, currDepth, maxDepth} = e.data || e
  
    if (currDepth > 0) postMessage(((currDepth)/(maxDepth))*100)
  
    if (currDepth === maxDepth) {
      // set up swatch
      const swatchColor = pixelArray.reduce(
        (prev, curr) => {
          prev.r += curr.r
          prev.g += curr.g
          prev.b += curr.b
          return prev
        },
        {
          r: 0,
          g: 0,
          b: 0
        }
      )
  
      swatchColor.r = Math.round(swatchColor.r / pixelArray.length)
      swatchColor.g = Math.round(swatchColor.g / pixelArray.length)
      swatchColor.b = Math.round(swatchColor.b / pixelArray.length)
  
      return ([swatchColor])
    } else {
  
      const split = pixelArray.length / 2
      const swatch = [
        ...buildSwatchRecursive({pixelArray: pixelArray.slice(0, split), currDepth: currDepth + 1, maxDepth}),
        ...buildSwatchRecursive({pixelArray: pixelArray.slice(split + 1), currDepth: currDepth + 1, maxDepth})
      ]
      return(swatch)
    }
  }
  const finalSwatch = buildSwatchRecursive(e)
  postMessage(finalSwatch)
}
// const buildSwatchRecursive = (pixelArray, currDepth, maxDepth, swatchProgressListener) => {
//   if (currDepth === maxDepth) {
//     // set up swatch
//     const swatchColor = pixelArray.reduce(
//       (prev, curr) => {
//         prev.r += curr.r
//         prev.g += curr.g
//         prev.b += curr.b
//         return prev
//       },
//       {
//         r: 0,
//         g: 0,
//         b: 0
//       }
//     )

//     swatchColor.r = Math.round(swatchColor.r / pixelArray.length)
//     swatchColor.g = Math.round(swatchColor.g / pixelArray.length)
//     swatchColor.b = Math.round(swatchColor.b / pixelArray.length)

//     return [swatchColor]
//   } else {
//     // first find which color to sort by
//     const sortColor = findLargeRange(pixelArray)

//     pixelArray.sort((pixel1, pixel2) => {
//       return pixel1[sortColor] - pixel2[sortColor]
//     })

//     const split = pixelArray.length / 2
//     const swatch = [
//       ...buildSwatchRecursive(pixelArray.slice(0, split), currDepth + 1, maxDepth, swatchProgressListener),
//       ...buildSwatchRecursive(pixelArray.slice(split + 1), currDepth + 1, maxDepth, swatchProgressListener)
//     ]
//     swatchProgressListener((currDepth+1/maxDepth+1)*100)
//     return swatch
//   }
// }

const findLargeRange = pixelBucket => {
  let rMin = 255
  let rMax = 0

  let gMin = 255
  let gMax = 0

  let bMin = 255
  let bMax = 0

  for (const pixel of pixelBucket) {
    rMin = rMin < pixel.r ? rMin : pixel.r
    rMax = rMax > pixel.r ? rMax : pixel.r
    gMin = gMin < pixel.g ? gMin : pixel.g
    gMax = gMax > pixel.g ? gMax : pixel.g
    bMin = bMin < pixel.b ? bMin : pixel.b
    bMax = bMax > pixel.b ? bMax : pixel.b
  }

  const rRange = rMax - rMin
  const gRange = gMax - gMin
  const bRange = bMax - bMin

  if (rRange > gRange && rRange > bRange) {
    return 'r'
  } else if (gRange > rRange && gRange > bRange) {
    return 'g'
  } else {
    return 'b'
  }
}