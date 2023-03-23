const Gameboard = () => {
  // .map is used here to pass new instances of the object (.fill passes references)
  const board = new Array(100).fill().map(() => ({ hasShip: false, isShot: false }))

  const convertTo2DIndex = (index1D) => {
    const indexStr = index1D.toString()
    let row
    let col

    if (indexStr.length === 1) {
      col = Number(indexStr[0])
      row = 0
    } else {
      row = Number(indexStr[0])
      col = Number(indexStr[1])
    }
    return [row, col]
  }

  const createLocationArray = (ship, location, axis) => {
    const locationArray = []
    for (let i = 0; i < ship.length; i += 1) {
      if (axis === 'x') {
        locationArray.push(location + i)
      } else {
        locationArray.push(location + i * 10)
      }
    }
    return locationArray
  }

  const getNeighborArray = (shipLocationArray) => {
    const surroundings = new Set()
    const neighborPattern = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    const boardSize = 10

    // Add indexes of neighbor cells to the set
    for (let i = 0; i < shipLocationArray.length; i += 1) {
      const locationIndex2D = convertTo2DIndex(shipLocationArray[i])

      for (let n = 0; n < neighborPattern.length; n += 1) {
        const x = neighborPattern[n][0] + locationIndex2D[0]
        const y = neighborPattern[n][1] + locationIndex2D[1]
        const boardMaxIndexSize = boardSize - 1
        if (x < 0 || x > boardMaxIndexSize || y < 0 || y > boardMaxIndexSize) {
          // eslint-disable-next-line no-continue
          continue
        }
        // Convert back to 1D array index and add to the set
        surroundings.add(Number([x, y].join('')))
      }
    }

    // Filter out the indexes of ship cells from the set
    surroundings.forEach((num) => {
      if (shipLocationArray.includes(num)) surroundings.delete(num)
    })

    return Array.from(surroundings)
  }

  const checkCollisions = (shipLocationArray) => {
    const collisions = [9, 19, 29, 39, 49, 59, 69, 79, 89]
    // Check if ship placement exceeds board boundries (y axis collisions)
    if (shipLocationArray.some((loc) => !board[loc])) return false

    // Check collisions with other ships
    if (shipLocationArray.some((loc) => board[loc].hasShip)) return false

    // Check collisions with the x axis
    // eslint-disable-next-line max-len
    if (collisions.some((n) => [n, n + 1].every((indexes) => shipLocationArray.includes(indexes)))) return false

    return true
  }

  const checkIfNeighborCellsAreEmpty = (shipNeighborArray) => {
    if (shipNeighborArray.some((neighborIdx) => board[neighborIdx].hasShip)) return false
    return true
  }

  const placeShip = (ship, location, axis = 'x') => {
    const locationArray = createLocationArray(ship, location, axis)
    const neighbors = getNeighborArray(locationArray)
    const msg = `Placement of ship of length ${ship.length} at index ${location} on axis ${axis.toUpperCase()} is not valid.`
    if (!checkCollisions(locationArray) || !checkIfNeighborCellsAreEmpty(neighbors)) {
      throw new Error(msg)
    }

    locationArray.forEach((loc) => {
      board[loc].hasShip = ship
    })
    return true
  }

  const checkIfShotHit = (location) => !!(board[location].hasShip)

  const receiveAttack = (location) => {
    if (checkIfShotHit(location)) board[location].hasShip.hit()
    board[location].isShot = true
  }

  const isGameOver = () => {
    const shipSet = new Set()
    let sunkShipsCounter = 0

    board.forEach((cell) => {
      if (cell.hasShip) shipSet.add(cell.hasShip)
    })

    shipSet.forEach((ship) => {
      if (ship.isSunk()) sunkShipsCounter += 1
    })

    return shipSet.size === sunkShipsCounter
  }

  return {
    board,
    createLocationArray,
    getNeighbors: getNeighborArray,
    checkCollisions,
    placeShip,
    checkIfShotHit,
    receiveAttack,
    isGameOver,
  }
}

export default Gameboard
