import Canvas from 'canvas'

// will grab image data from upload
export const convertImgData = async (fileObj) => {
    // create object url to feed to loadImage()
    const fileUrl = URL.createObjectURL(fileObj)
  
    // create temp img
    const image = await Canvas.loadImage(fileUrl)
  
    //get image height & width
    const width = image.naturalWidth
    const height = image.naturalHeight
  
    const canvas = Canvas.createCanvas(width, height)
    const context = canvas.getContext('2d')
  
    context.drawImage(image, 0, 0)
    const imgData = context.getImageData(0, 0, width, height)
    return imgData.data
  }