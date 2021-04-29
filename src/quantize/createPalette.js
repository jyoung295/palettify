import Canvas from 'canvas'
import { convertImgData } from './convert-file';
var convert = require('color-convert');

export const createPalette = async (rawPaletteData) => {
  const {rawPalette, file} = rawPaletteData
  console.log(rawPalette)
  console.log(file)

  const paletteColorsArray = buildPaletteColorsArray(rawPalette)
  console.log(paletteColorsArray)

  const fileUrl = URL.createObjectURL(file)

  // create temp img
  const image = await Canvas.loadImage(fileUrl)
  
  //get image height & width
  const width = image.naturalWidth
  const height = image.naturalHeight


  const swatchCanvas = Canvas.createCanvas(width, height*2)
  const ctx = swatchCanvas.getContext('2d')

  // ctx.drawImage(photo, 0, 0, 960, 473)
  // const half = rawSwatch.length / 2
  // let counter = 0
  // for (const color of rawSwatch) {
  //   ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
  //   if (counter < half) {
  //     ctx.fillRect(counter * 240, 473, 240, 245)
  //   } else {
  //     ctx.fillRect((counter - 4) * 240, 718, 240, 245)
  //   }
  //   counter++
  // }
  // return swatchCanvas.toBuffer()
}

const buildPaletteColorsArray = (rawPalette) => {
  let paletteColorsArray = []
  rawPalette.forEach((color) => {
    paletteColorsArray.push({
      hex: convert.rgb.hex(color.r, color.g, color.b),
      rgb: `${color.r} ${color.g} ${color.b}`,
      cmyk: convert.rgb.cmyk(color.r, color.g, color.b)
    })
  })
  return paletteColorsArray
}
