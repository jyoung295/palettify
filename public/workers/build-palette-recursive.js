// build swatch worker function runs a simple median cut algorithm recursively to build a color palette based on the depth input 2^(maxDepth)
onmessage = function(e) {
  
    const buildSwatchRecursive = (e) => {
      let {pixelArray, currDepth, maxDepth} = e.data || e
    
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
  
        if (currDepth > 0) postMessage(((currDepth)/(maxDepth))*100)
        return(swatch)
      }
    }
    const finalSwatch = buildSwatchRecursive(e)
    postMessage(finalSwatch)
  }