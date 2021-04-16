import Canvas from 'canvas'

// will grab image data from upload
const getImage = async () => {
  const image = await Canvas.loadImage(todaysPhotoUrl)
  const canvas = Canvas.createCanvas(1920, 946)
  const context = canvas.getContext('2d')

  context.drawImage(image, 0, 0)
  const imgData = context.getImageData(0, 0, 1920, 946)
  return { imgData: imgData.data, photo: image, name: submitterName }
}

// pull the image data array from the photo
// convert that array into array of pixel objects
const getPixelArray = async rgbArray => {
  let pixelArray = []
  let pixelObj = {}
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
    }
  }
  return pixelArray
}

// returns the swatch array
export const quantize = async () => {
  const { imgData, photo, name } = await getImage()
  const pixelArray = await getPixelArray(imgData)

  const swatch = buildSwatchRecursive(pixelArray, 0, 3)

  // sort swatch by largest range
  const sortColor = findLargeRange(swatch)
  swatch.sort((color1, color2) => {
    return color1[sortColor] - color2[sortColor]
  })
  return { swatch, photo, name }
}

const buildSwatchRecursive = (pixelArray, currDepth, maxDepth) => {
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

    return [swatchColor]
  } else {
    // first find which color to sort by
    const sortColor = findLargeRange(pixelArray)

    pixelArray.sort((pixel1, pixel2) => {
      return pixel1[sortColor] - pixel2[sortColor]
    })

    const split = pixelArray.length / 2
    const swatch = [
      ...buildSwatchRecursive(pixelArray.slice(0, split), currDepth + 1, maxDepth),
      ...buildSwatchRecursive(pixelArray.slice(split + 1), currDepth + 1, maxDepth)
    ]
    return swatch
  }
}

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
