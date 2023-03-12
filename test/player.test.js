import Player from '../src/modules/player'
import Gameboard from '../src/modules/gameboard'

let player
let enemyBoard

beforeEach(() => {
  player = Player('John')
  enemyBoard = Gameboard()
})

describe('Player Instantiation', () => {
  it('Creates a player with a name', () => {
    expect(player.name).toBe('John')
  })
})

describe('attack() method', () => {
  it('Attacks the enemy gameboard', () => {
    player.attack(72, enemyBoard)
    expect(enemyBoard.board[72].isShot).toBe(true)
  })

  it('Only attacks a valid cell (Not have been attacked yet)', () => {
    // Attack an invalid cell (have already been attacked)
    enemyBoard.board[12].isShot = true
    expect(player.attack(12, enemyBoard)).toBe(false)

    // Attack a valid cell
    expect(player.attack(99, enemyBoard)).toBe(true)
  })
})

describe('makeRandomAttack() method', () => {
  it('Attacks a random cell on the board', () => {
    expect(player.makeRandomAttack(enemyBoard)).toBe(true)
  })

  it('Only attacks a cell which is not shot yet', () => {
    // Loop the board and make each cell isShot = true, only leave one cell isShot = false
    for (let i = 0; i < enemyBoard.board.length; i += 1) {
      if (i !== 43) enemyBoard.board[i].isShot = true
    }

    player.makeRandomAttack(enemyBoard)
    expect(enemyBoard.board[43].isShot).toBe(true)
  })
})
