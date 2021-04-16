import Canvas from 'canvas'

export const createSwatch = (rawSwatch, photo) => {
  const swatchCanvas = Canvas.createCanvas(960, 963)
  const ctx = swatchCanvas.getContext('2d')

  ctx.drawImage(photo, 0, 0, 960, 473)
  const half = rawSwatch.length / 2
  let counter = 0
  for (const color of rawSwatch) {
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
    if (counter < half) {
      ctx.fillRect(counter * 240, 473, 240, 245)
    } else {
      ctx.fillRect((counter - 4) * 240, 718, 240, 245)
    }
    counter++
  }
  return swatchCanvas.toBuffer()
}
