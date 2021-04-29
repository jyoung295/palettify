import Canvas from 'canvas'
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


  const paletteCanvas = Canvas.createCanvas(width, height*2)
  const ctx = paletteCanvas.getContext('2d')

  ctx.drawImage(image, 0, 0)
  paletteColorsArray.forEach((color, i) => {
    ctx.fillStyle = `#${color.hex}`
    if (i > 4) {
      ctx.fillRect(i * (width/4), (height*2), (width/4), (height/4))
    } else {
      ctx.fillRect((i - 4) * (width/4), (height*2) + (height/4), (width/4), (height/4))
    }
  })

  return({paletteColorsArray, paletteCanvas: paletteCanvas.toDataURL()})
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
