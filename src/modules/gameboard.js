const Gameboard = () => {
  // .map is used here to pass new instances of the object (.fill passes references)
  const board = new Array(100).fill().map(() => ({ hasShip: false, isShot: false }))

  return {
    board,
    createLocationArray(ship, location, axis) {
      const locationArray = []
      for (let i = 0; i < ship.length; i += 1) {
        if (axis === 'x') {
          locationArray.push(location + i)
        } else {
          locationArray.push(location + i * 10)
        }
      }
      return locationArray
    },
    checkCollisions(shipLocationArray) {
      const collisions = [9, 19, 29, 39, 49, 59, 69, 79, 89]
      // Check if ship placement exceeds board boundries (y axis collisions)
      if (shipLocationArray.some((loc) => !this.board[loc])) return false

      // Check collisions with other ships
      if (shipLocationArray.some((loc) => this.board[loc].hasShip)) return false

      // Check collisions with the x axis
      // eslint-disable-next-line max-len
      if (collisions.some((n) => [n, n + 1].every((indexes) => shipLocationArray.includes(indexes)))) return false
      return true
    },
    placeShip(ship, location, axis = 'x') {
      const locationArray = this.createLocationArray(ship, location, axis)
      if (!this.checkCollisions(locationArray)) return

      locationArray.forEach((loc) => {
        this.board[loc].hasShip = ship
      })
    },
    checkIfShotHit(location) {
      return !!(this.board[location].hasShip)
    },
    receiveAttack(location) {
      if (this.checkIfShotHit(location)) this.board[location].hasShip.hit()
      this.board[location].isShot = true
    },
    isGameOver() {
      const shipSet = new Set()
      let sunkShipsCounter = 0

      this.board.forEach((cell) => {
        if (cell.hasShip) shipSet.add(cell.hasShip)
      })

      shipSet.forEach((ship) => {
        if (ship.isSunk()) sunkShipsCounter += 1
      })

      return shipSet.size === sunkShipsCounter
    },
  }
}

export default Gameboard
