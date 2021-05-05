import Canvas from 'canvas'

// const RESIZE_MAX_PIXELS = undefined
const RESIZE_MAX_PIXELS = 50000

// will grab image data from upload
export const convertImgData = async (fileObj) => {
  // create object url to feed to loadImage()
  const fileUrl = URL.createObjectURL(fileObj)

  // create temp img
  const image = await Canvas.loadImage(fileUrl)

  //get image height & width
  let canvasWidth = image.naturalWidth
  let canvasHeight = image.naturalHeight

  const imagePixels = canvasWidth * canvasHeight

  // check that we set a max pixel size to resize to
  // and that the original image is larger than the max pixel size
  if (RESIZE_MAX_PIXELS !== undefined && imagePixels > RESIZE_MAX_PIXELS) {
    const scaled = scaleDownImg(canvasWidth, canvasHeight, RESIZE_MAX_PIXELS)
    canvasWidth = scaled.w
    canvasHeight = scaled.h
  }

  const canvas = Canvas.createCanvas(canvasWidth, canvasHeight)
  const context = canvas.getContext('2d')

  context.drawImage(image, 0, 0, canvasWidth, canvasHeight)
  const imgData = context.getImageData(0, 0, canvasWidth, canvasHeight)

  return imgData.data
}

const scaleDownImg = (w, h, pixels) => {
  const ratio = w / h;
  const scaleFactor = Math.sqrt(pixels / ratio);
  const rescaledW = Math.floor(ratio * scaleFactor);
  const rescaledH = Math.floor(scaleFactor);
  return {w: rescaledW, h: rescaledH};
}