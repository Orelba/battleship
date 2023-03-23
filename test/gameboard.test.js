import Gameboard from '../src/modules/gameboard'
import Ship from '../src/modules/ship'

let gameBoard
let testBoard

beforeEach(() => {
  gameBoard = Gameboard()
  testBoard = [...gameBoard.board]
})

describe('Gameboard Object Instantiation', () => {
  it('Instantiates a 10x10 board correctly', () => {
    const board = new Array(100).fill({ hasShip: false, isShot: false })

    expect(gameBoard.board).toEqual(board)
  })
})

describe('createLocationArray() method', () => {
  it('Creates location array of a ship', () => {
    const ship = Ship(3)

    expect(gameBoard.createLocationArray(ship, 25, 'x')).toEqual([25, 26, 27])
    expect(gameBoard.createLocationArray(ship, 32, 'y')).toEqual([32, 42, 52])
  })
})

describe('getNeighbors() method', () => {
  it('Returns an array of the indexes of all neighbor cells', () => {
    // I am sorting each one to check array equality easily
    const topRowPlacement = gameBoard.getNeighbors([1, 11, 21]).sort((a, b) => a - b)
    const cornerPlacement = gameBoard.getNeighbors([97, 98, 99]).sort((a, b) => a - b)
    const middlePlacement = gameBoard.getNeighbors([45, 55, 65, 75]).sort((a, b) => a - b)

    expect(topRowPlacement).toEqual([0, 2, 10, 12, 20, 22, 30, 31, 32])
    expect(cornerPlacement).toEqual([86, 87, 88, 89, 96])
    expect(middlePlacement).toEqual([34, 35, 36, 44, 46, 54, 56, 64, 66, 74, 76, 84, 85, 86])
  })
})

describe('checkCollisions() method', () => {
  it('Rejects ship placement that collides with the x axis wall', () => {
    expect(gameBoard.checkCollisions([8, 9, 10, 11])).toBe(false)
  })

  it('Rejects ship placement that collides with the y axis wall', () => {
    expect(gameBoard.checkCollisions([85, 95, 105, 115])).toBe(false)
  })

  it('Rejects ship placement that collides with other ships', () => {
    const ship = Ship(3)

    gameBoard.board[47] = { hasShip: ship, isShot: false }
    gameBoard.board[57] = { hasShip: ship, isShot: false }
    gameBoard.board[67] = { hasShip: ship, isShot: false }

    expect(gameBoard.checkCollisions([57, 67, 77])).toBe(false)
  })
})

describe('placeShip() method', () => {
  it('Allows placing a ship at specific coordinates on x axis', () => {
    const ship = Ship(4)

    gameBoard.placeShip(ship, 25, 'x')

    testBoard[25] = { hasShip: ship, isShot: false }
    testBoard[26] = { hasShip: ship, isShot: false }
    testBoard[27] = { hasShip: ship, isShot: false }
    testBoard[28] = { hasShip: ship, isShot: false }

    expect(gameBoard.board).toMatchObject(testBoard)
  })

  it('Allows placing a ship at specific coordinates on y axis', () => {
    const ship = Ship(3)

    gameBoard.placeShip(ship, 22, 'y')

    testBoard[22] = { hasShip: ship, isShot: false }
    testBoard[32] = { hasShip: ship, isShot: false }
    testBoard[42] = { hasShip: ship, isShot: false }

    expect(gameBoard.board).toMatchObject(testBoard)
  })

  it('Rejects ship placement that does not leave space around other ships', () => {
    const shipOne = Ship(3)

    gameBoard.board[41] = { hasShip: shipOne, isShot: false }
    gameBoard.board[42] = { hasShip: shipOne, isShot: false }
    gameBoard.board[43] = { hasShip: shipOne, isShot: false }

    const partOfErrorMsg = 'is not valid.'
    expect(() => gameBoard.placeShip(shipOne, 52, 'x')).toThrow(partOfErrorMsg)
    expect(() => gameBoard.placeShip(shipOne, 41, 'x')).toThrow(partOfErrorMsg)
    expect(gameBoard.placeShip(shipOne, 64, 'x')).toBe(true)
    expect(gameBoard.placeShip(shipOne, 72, 'y')).toBe(true)
  })
})

describe('Receiving a hit', () => {
  it('Checks if shot hit', () => {
    const ship = Ship(5)
    gameBoard.board[34] = { hasShip: ship, isShot: false }

    expect(gameBoard.checkIfShotHit(34)).toBe(true)
    expect(gameBoard.checkIfShotHit(23)).toBe(false)
  })

  describe('receiveAttack() method', () => {
    it('Sends the hit function to the correct ship', () => {
      const shipOne = Ship(2)
      const shipTwo = Ship(3)

      gameBoard.board[22].hasShip = shipOne
      gameBoard.board[23].hasShip = shipOne

      gameBoard.board[65].hasShip = shipTwo
      gameBoard.board[66].hasShip = shipTwo
      gameBoard.board[67].hasShip = shipTwo

      gameBoard.receiveAttack(65)

      expect(shipOne.hitCount).toBe(0)
      expect(shipTwo.hitCount).toBe(1)
    })

    it('Changes the correct isShot property of the board cell object to true when hit', () => {
      gameBoard.receiveAttack(23)
      gameBoard.receiveAttack(70)

      expect(gameBoard.board[22].isShot).toBe(false)
      expect(gameBoard.board[23].isShot).toBe(true)
      expect(gameBoard.board[70].isShot).toBe(true)
    })
  })

  it('Keeps track of missed shots', () => {
    gameBoard.board[23].isShot = true
    gameBoard.board[26].isShot = true

    expect(gameBoard.board[23]).toEqual({ hasShip: false, isShot: true })
    expect(gameBoard.board[26]).toEqual({ hasShip: false, isShot: true })
  })
})

describe('isGameOver() method', () => {
  it('Checks if all ships are sunk', () => {
    const shipOne = Ship(2)
    const shipTwo = Ship(3)

    gameBoard.board[22] = { hasShip: shipOne, isShot: false }
    gameBoard.board[23] = { hasShip: shipOne, isShot: true }
    shipOne.hitCount = 1
    expect(gameBoard.isGameOver()).toBe(false)

    gameBoard.board[74] = { hasShip: shipTwo, isShot: false }
    gameBoard.board[75] = { hasShip: shipTwo, isShot: true }
    gameBoard.board[76] = { hasShip: shipTwo, isShot: true }
    shipTwo.hitCount = 2
    expect(gameBoard.isGameOver()).toBe(false)

    gameBoard.board[22].isShot = true
    shipOne.hitCount = 2
    expect(gameBoard.isGameOver()).toBe(false)

    gameBoard.board[74].isShot = true
    shipTwo.hitCount = 3
    expect(gameBoard.isGameOver()).toBe(true)
  })
})
