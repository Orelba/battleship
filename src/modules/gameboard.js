const Gameboard = () => {
  // .map is used here to pass new instances of the object (.fill passes references)
  const board = new Array(100).fill().map(() => ({ hasShip: false, isShot: false }))

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

  const placeShip = (ship, location, axis = 'x') => {
    const locationArray = createLocationArray(ship, location, axis)
    if (!checkCollisions(locationArray)) {
      const msg = `Placement of ship of length ${ship.length} at index ${location} on axis ${axis.toUpperCase()} is not valid.`
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
    checkCollisions,
    placeShip,
    checkIfShotHit,
    receiveAttack,
    isGameOver,
  }
}

export default Gameboard
