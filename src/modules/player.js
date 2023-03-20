const Player = (name) => {
  const generateRandomLocFromArray = (array) => array[Math.floor(Math.random() * array.length)]

  const attack = (location, gameboard) => {
    if (gameboard.board[location].isShot) return false
    gameboard.receiveAttack(location)
    return true
  }

  const makeRandomAttack = (gameboard) => {
    // Make array of valid board indexes with isShot === false
    const validCellsArr = gameboard.board.reduce((acc, curr, idx) => {
      if (!curr.isShot) acc.push(idx)
      return acc
    }, [])
    // Choose a random location from the valid indexes array
    const randomLoc = generateRandomLocFromArray(validCellsArr)

    return attack(randomLoc, gameboard)
  }

  return {
    name,
    attack,
    makeRandomAttack,
  }
}

export default Player
