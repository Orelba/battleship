import Ship from './ship'
import Gameboard from './gameboard'
import Player from './player'
import UI from './UI'

export default class Game {
  // State
  static player = Player('Friendly')

  static enemy = Player('Enemy')

  static playerBoard = Gameboard()

  static enemyBoard = Gameboard()

  static takesTurn = 'Player'

  static placementBoard = Gameboard()

  static ships = [
    ['Carrier', Ship(5)],
    ['Battleship', Ship(4)],
    ['Destroyer', Ship(3)],
    ['Submarine', Ship(3)],
    ['Patrol Boat', Ship(2)],
  ]

  static currShip = Game.ships[0]

  static isPlacementDone = false

  // Game Sequence

  static init() {
    UI.loadGameUI()
    Game.preGameOverlay()
    UI.initEnemyBoardEventListener(Game.makePlayerMove)
  }

  static restart() {
    Game.resetGameState()
    UI.clearAllGameboardCells()
    Game.preGameOverlay()
  }

  static setupEnemyBoard() {
    const eShip1 = Ship(5)
    const eShip2 = Ship(4)
    const eShip3 = Ship(3)
    const eShip4 = Ship(3)
    const eShip5 = Ship(2)

    Game.enemyBoard.placeShipInRandomLocation(eShip1)
    Game.enemyBoard.placeShipInRandomLocation(eShip2)
    Game.enemyBoard.placeShipInRandomLocation(eShip3)
    Game.enemyBoard.placeShipInRandomLocation(eShip4)
    Game.enemyBoard.placeShipInRandomLocation(eShip5)
  }

  static hoverOnPlacementBoard(location, axis) {
    if (!Game.isPlacementDone) {
      const locationArray = Game.placementBoard.createLocationArray(
        Game.currShip[1],
        location,
        axis,
      )

      const isValid = Game.placementBoard.isPlacementValid(
        Game.currShip[1],
        location,
        axis,
      )

      const isColliding = Game.placementBoard.checkCollisions(locationArray)

      UI.renderShipOnHover(Game.placementBoard, locationArray, isValid, isColliding)
    }
  }

  static placeOnPlacementBoard(location, axis) {
    const currShipIdx = Game.ships.indexOf(Game.currShip)
    const nextShipIdx = currShipIdx + 1

    if (currShipIdx > 4 || currShipIdx === -1) return

    if (Game.placementBoard.isPlacementValid(Game.currShip[1], location, axis)) {
      Game.placementBoard.placeShip(Game.currShip[1], location, axis)
      Game.currShip = Game.ships[nextShipIdx]
      UI.renderOverlayGameboard(Game.placementBoard)
      if (currShipIdx < 4) UI.renderPlacementOverlayText(`Place Your ${Game.currShip[0]}`)
      if (nextShipIdx > 4) {
        Game.isPlacementDone = true
        UI.renderPlacementOverlayText('Get Ready...')
        UI.toggleStartButtonDisabled()
        UI.initStartButtonEventListener(Game.start)
      }
    }
  }

  static preGameOverlay() {
    UI.renderPlacementOverlay()
    UI.initRotateBtnEventListener()
    UI.initPlacementBoardEventListeners(Game.hoverOnPlacementBoard, Game.placeOnPlacementBoard)
    UI.initStartButtonEventListener()
  }

  static start() {
    Game.playerBoard.board = Object.assign(Game.playerBoard.board, Game.placementBoard.board)
    Game.setupEnemyBoard()
    UI.clearAllGameboardCells()
    UI.hideOverlay()
    UI.renderPlayerGameboard(Game.playerBoard)
    UI.renderEnemyGameboard(Game.enemyBoard)
  }

  static resetGameState() {
    Game.playerBoard = Gameboard()
    Game.enemyBoard = Gameboard()
    Game.placementBoard = Gameboard()

    Game.takesTurn = 'Player'

    Game.ships[0][1] = Ship(5)
    Game.ships[1][1] = Ship(4)
    Game.ships[2][1] = Ship(3)
    Game.ships[3][1] = Ship(3)
    Game.ships[4][1] = Ship(2)

    // eslint-disable-next-line prefer-destructuring
    Game.currShip = Game.ships[0]

    Game.isPlacementDone = false
  }

  static end(announceWinnerString) {
    UI.renderEndGameOverlay(announceWinnerString)
    UI.initRestartGameEventListener(Game.restart)
  }

  // Move Loop
  static makeEnemyMove() {
    Game.enemy.makeRandomAttack(Game.playerBoard)
    UI.renderPlayerGameboard(Game.playerBoard)
    if (Game.playerBoard.isGameOver()) Game.end('Enemy Wins!')
    else Game.takesTurn = 'Player'
  }

  static async makePlayerMove(index) {
    if (Game.takesTurn === 'Player' && !Game.enemyBoard.board[index].isShot) {
      Game.player.attack(index, Game.enemyBoard)
      UI.renderEnemyGameboard(Game.enemyBoard)

      if (Game.enemyBoard.isGameOver()) Game.end('You Win!')
      else {
        Game.takesTurn = 'Enemy'
        await Game.sleepRandomTimeBetween(300, 600)
        Game.makeEnemyMove()
      }
    }
  }

  // Utility
  static sleepRandomTimeBetween(minMs, maxMs) {
    const randomTimeMs = Math.floor(Math.random() * (maxMs - minMs + 1) + minMs)

    return new Promise((resolve) => { setTimeout(resolve, randomTimeMs) })
  }
}
