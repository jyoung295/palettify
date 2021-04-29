// called from App.js to run the quanitzation process functions
export const quantize = async (imgData, progressListener) => {
  const quantizeParentWorker = new Worker('./workers/get-pixel-array.js')

  quantizeParentWorker.postMessage(imgData)

  quantizeParentWorker.onmessage = e => {
    if (typeof e.data === 'number') {
      progressListener(e.data)
    } else {
      progressListener(100)
      progressListener(e.data)
      quantizeParentWorker.terminate()
    }
  }
}