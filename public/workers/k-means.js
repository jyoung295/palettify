/* eslint-disable no-mixed-operators */
onmessage = function(e) {

  const {pixelArray, k} = e.data
  // mulberry32 - an actual high quality 32-bit generator
  // courtesy of https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32
  // const random = (a) => {
  //     a |= 0; a = a + 0x6D2B79F5 | 0;
  //     let t = Math.imul(a ^ a >>> 15, 1 | a);
  //     t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  //     return ((t ^ t >>> 14) >>> 0) / 4294967296;
  // }

  // euclidian distance formula for pixel objects
  // const distance = (color1, color2) => {
  //     const {r: r1, g: g1, b: b1} = color1
  //     const {r: r2, g: g2, b: b2} = color2

  //     return Math.sqrt( Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2))
  // }

  // pick initial centroids randomly 
  // (seeded so that it's the same each time for the same data)
  // const intlCentroids = []
  // for (let i = 0; i < k; i++) {
  //     let index = Math.floor(random(i*21) * pixelArray.length)
  //     intlCentroids.push(pixelArray[index])
  // }

  // with initial centroids, find distance to all colors
  // loops through all colors, stores distnace from each color to each center,
  // compares those distances to find the closest center for the color 
  // then reassigns that color as the center's color
  // let limiter = 0
  // let progress = 0
  // const centroidDistances = new Array(k)
  // for(let i = 0; i < pixelArray.length; i++) {
  //     for(let j = 0; j < intlCentroids.length; j++) {
  //         centroidDistances[j] = distance(intlCentroids[j],  pixelArray[i])
  //         // if(i === 3) distance(intlCentroids[j],  pixelArray[i])
  //     }
  //     const minimumDistance = Math.min(...centroidDistances)
  //     const closestCentersIndex = centroidDistances.indexOf(minimumDistance)
  //     pixelArray[i] = intlCentroids[closestCentersIndex]
  //     if (limiter%50000 === 0 || limiter === (pixelArray.length - 1)) {
  //     // update progress variable, send while this loop runs
  //     // this function makes up 50% of total progress
  //     progress = ((i/pixelArray.length)*50)
  //     postMessage(progress)
  //     }
  // }

  const objectsEqual = (a1, a2) => {
    if (Object.keys(a1).length !== Object.keys(a2).length) return false
    if (a1.r !== a2.r || a1.g !== a2.g || a1.b !== a2.b) return false
    return true
  }

  // Given a point and a list of neighbor points, 
  // return the index for the neighbor that's closest to the point.
  const nearest_neighbor = (point, neighbors) => {
    let nearest = Infinity // squared distance
    let nearestIndex = -1
    neighbors.forEach((neighbor, i) => {
      const {r: r1, g: g1, b: b1} = point
      const {r: r2, g: g2, b: b2} = neighbor

      const distance = Math.sqrt( Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2))
      if (distance < nearest) {
        nearest = distance
        nearestIndex = i
      }
    })
    return nearestIndex
  }
  
  // Returns the centroid of a dataset.
  const centroid = (dataset) => {
    // console.log(dataset)
    if (dataset.length === 0) return {}
    // Calculate running means.
    let runningCentroid = dataset[0]
    // for (let i = 0; i < dataset[0].length; ++i) {
    //   running_centroid.push(0)
    // }
    dataset.forEach((point, i) => {
      runningCentroid = {
        r: runningCentroid.r + ((point.r - runningCentroid.r) / (i+1)),
        g: runningCentroid.g + ((point.g - runningCentroid.g) / (i+1)),
        b: runningCentroid.b + ((point.b - runningCentroid.b) / (i+1)),
      }
      // for (let j = 0; j < point.length; ++j) {
      //   if(i === 0) console.log(point[j])
      //   running_centroid[j] += (point[j] - running_centroid[j]) / (i+1)
      // }
    })
    
    return runningCentroid
  }
  
  // Returns the k-means centroids.
  const kMeans = (dataset, k) => {
    if (k === undefined) k = Math.min(3, dataset.length)

    // Use a seeded random number generator instead of Math.random(),
    // so that k-means always produces the same centroids for the same input.
    let seed = 0
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    // Choose initial centroids randomly.
    let centroids = []
    for (let i = 0; i < k; ++i) {
      const index = Math.floor(random() * dataset.length)
      centroids.push(dataset[index])
    }

    // this while loop continually recalculates the centroids of each cluster
    // until eventually the new centroid does not change because it
    // has been narrowed down to the correct centroid
    while (true) {
      // 'clusters' is an array of arrays. each sub-array corresponds to
      // a cluster, and has the points in that cluster.
      let clusters = []
      for (var i = 0; i < k; ++i) {
        clusters.push([])
      }

      dataset.forEach((point, i) => {
        const nearest_centroid = nearest_neighbor(point, centroids)
        clusters[nearest_centroid].push(point)
      })
      
      let converged = true
      clusters.forEach((cluster, i) => {
        let newClusterCentroid = []
        if (cluster.length > 0) {
          newClusterCentroid = centroid(cluster)
        } else {
          // For an empty cluster, set a random point as the centroid.
          const index = Math.floor(random() * dataset.length)
          newClusterCentroid = dataset[index]
        }
        converged = converged && objectsEqual(newClusterCentroid, centroids[i])
        centroids[i] = newClusterCentroid
      })

      
      if (converged) break
    }
    return centroids
  }

    postMessage(kMeans(pixelArray, k))
     
}