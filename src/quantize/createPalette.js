import Canvas from 'canvas'
var convert = require('color-convert');

export const createPalette = async (rawPaletteData) => {
  const {rawPalette, file} = rawPaletteData

  const sortedPalette = sortColorsByHue(rawPalette)

  const paletteColorsArray = buildPaletteColorsArray(sortedPalette)

  const fileUrl = URL.createObjectURL(file)

  // create temp img
  const image = await Canvas.loadImage(fileUrl)
  
  //get image height & width
  const width = image.naturalWidth
  const height = image.naturalHeight

  const paletteCanvas = Canvas.createCanvas(width, height*1.5)
  const ctx = paletteCanvas.getContext('2d')

  ctx.drawImage(image, 0, 0)
  paletteColorsArray.forEach((color, i) => {
    ctx.fillStyle = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
    if (i < 4) {
      ctx.fillRect(i * (width/4), height, (width/4), (height/4))
    } else {
      ctx.fillRect((i - 4) * (width/4), (height+(height/4)), (width/4), (height/4))
    }
  })

  return({paletteColorsArray, paletteCanvas: paletteCanvas.toDataURL()})
}

const buildPaletteColorsArray = (rawPalette) => {
  let paletteColorsArray = []
  rawPalette.forEach((color) => {
    paletteColorsArray.push({
      hex: convert.rgb.hex(color.r, color.g, color.b),
      rgb: {r: color.r, g: color.g, b: color.b},
      cmyk: convert.rgb.cmyk(color.r, color.g, color.b)
    })
  })
  return paletteColorsArray
}

const sortColorsByHue = (rawPalette) => {
  // convert to hsv
  let hsvArray = []
  rawPalette.forEach((color) => {
    hsvArray.push({
      hsv: convert.rgb.hsv(color.r, color.g, color.b)
    })
  })
  // sort by the hue value in each hsv color
  const sortedArray = mergeSort(hsvArray)

  // convert back to rgb
  let sortedRgbArray = []
  sortedArray.forEach((color) => {
    let convertedColor = convert.hsv.rgb(color.hsv)
    sortedRgbArray.push({
      r: convertedColor[0], g: convertedColor[1], b: convertedColor[2]
    })
  })

  return sortedRgbArray
}

const mergeSort = (array) => {
  const half = array.length / 2
  
  if(array.length < 2){
    return array 
  }
  
  const left = array.splice(0, half)
  return merge(mergeSort(left), mergeSort(array))
}

const merge = (left, right) => {
  let arr = []

  while (left.length && right.length) {
    if (left[0].hsv[0] < right[0].hsv[0]) {
        arr.push(left.shift())  
    } else {
        arr.push(right.shift()) 
    }
  }

  return [ ...arr, ...left, ...right ]
}