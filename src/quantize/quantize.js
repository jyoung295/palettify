// called from App.js to run the quanitzation process functions
export const quantize = async (imgDataObj, progressListener) => {
  const quantizeParentWorker = new Worker('./workers/get-pixel-array.js')

  quantizeParentWorker.postMessage(imgDataObj)

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