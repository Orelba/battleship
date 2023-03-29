export default class UI {
  static loadGameUI() {
    const pBoard = document.querySelector('.board.friendly')
    const eBoard = document.querySelector('.board.enemy')

    UI.renderGridCells(pBoard)
    UI.renderGridCells(eBoard)
  }

  // Gameboard
  static renderGridCells(gridElement) {
    for (let i = 0; i < 100; i += 1) {
      const cell = document.createElement('div')
      cell.classList.add('cell')

      gridElement.appendChild(cell)
    }
  }

  static renderShipCell(cellElement) {
    cellElement.classList.add('ship')
  }

  static renderHit(cellElement) {
    const img = document.createElement('img')
    img.src = '/images/hit.png'
    img.height = 35
    img.width = 35

    cellElement.appendChild(img)
    cellElement.classList.add('hit')
  }

  static renderMiss(cellElement) {
    const dot = document.createElement('div')
    dot.classList.add('dot')

    cellElement.classList.add('miss')
    cellElement.appendChild(dot)
  }

  static clearGameboardCells(cellsElementNodeList) {
    cellsElementNodeList.forEach((cell) => {
      cell.classList.remove('ship', 'ship-invalid', 'hit', 'miss')
      cell.replaceChildren()
    })
  }

  static clearAllGameboardCells() {
    const pBoardCells = document.querySelectorAll('.board.friendly .cell')
    const eBoardCells = document.querySelectorAll('.board.enemy .cell')

    UI.clearGameboardCells(pBoardCells)
    UI.clearGameboardCells(eBoardCells)
  }

  static renderPlayerGameboard(gameboard) {
    const pBoardCells = document.querySelectorAll('.board.friendly .cell')

    UI.clearGameboardCells(pBoardCells)

    gameboard.board.forEach((obj, idx) => {
      if (obj.hasShip && obj.isShot) {
        UI.renderHit(pBoardCells[idx])
      } else if (obj.hasShip && !obj.isShot) {
        UI.renderShipCell(pBoardCells[idx])
      } else if (!obj.hasShip && obj.isShot) {
        UI.renderMiss(pBoardCells[idx])
      }
    })
  }

  static renderEnemyGameboard(gameboard) {
    const eBoardCells = document.querySelectorAll('.board.enemy .cell')

    UI.clearGameboardCells(eBoardCells)

    gameboard.board.forEach((obj, idx) => {
      if (obj.hasShip && obj.isShot) {
        UI.renderHit(eBoardCells[idx])
      } else if (!obj.hasShip && obj.isShot) {
        UI.renderMiss(eBoardCells[idx])
      }
    })
  }

  // Handle board Events
  static boardEventHandler(e, boardElement, callbackFn, passAxis = false) {
    const child = e.target
    const idx = Array.prototype.indexOf.call(boardElement.children, child)

    // Prevent clicks on border and dragging of other board cells from passing to the function
    if (child.classList.contains('cell')) {
      if (passAxis) {
        const axis = document.querySelector('.rotate-btn').getAttribute('data-axis')
        callbackFn(idx, axis)
      } else {
        callbackFn(idx)
      }
    }
  }

  // Overlay
  static renderOverlayGameboard(gameboard) {
    const overlayBoardCells = document.querySelectorAll('.placement-container .board .cell')

    gameboard.board.forEach((obj, idx) => {
      if (obj.hasShip) UI.renderShipCell(overlayBoardCells[idx])
    })
  }

  static showOverlay() {
    const overlay = document.querySelector('.overlay')
    overlay.classList.add('show')
  }

  static clearOverlay() {
    const overlay = document.querySelector('.overlay')
    overlay.replaceChildren()
  }

  static hideOverlay() {
    const overlay = document.querySelector('.overlay')
    overlay.classList.remove('show')
    UI.clearOverlay()
  }

  static renderPlacementOverlay() {
    const modalDiv = document.createElement('div')
    modalDiv.classList.add('modal')

    const mainHeader = document.createElement('h1')
    mainHeader.textContent = 'Welcome to the battle'

    const placementHeader = document.createElement('h2')
    placementHeader.classList.add('placement-text')
    placementHeader.textContent = 'Place Your Carrier'

    const placementContainerDiv = document.createElement('div')
    placementContainerDiv.classList.add('placement-container')

    const rotateBtn = document.createElement('button')
    rotateBtn.classList.add('rotate-btn')
    rotateBtn.setAttribute('data-axis', 'x')

    const rotateBtnText = document.createElement('span')
    rotateBtnText.textContent = 'Rotate'

    const rotateBtnImg = document.createElement('img')
    rotateBtnImg.src = 'images/rotate.svg'
    rotateBtnImg.width = 15
    rotateBtnImg.height = 15

    rotateBtn.append(rotateBtnText, rotateBtnImg)

    const board = document.createElement('div')
    board.classList.add('board')
    UI.renderGridCells(board)

    placementContainerDiv.append(rotateBtn, board)

    const startBtn = document.createElement('button')
    startBtn.classList.add('main-btn', 'start', 'disabled')
    startBtn.textContent = 'Start Game'

    modalDiv.append(mainHeader, placementHeader, placementContainerDiv, startBtn)

    const overlay = document.querySelector('.overlay')
    overlay.replaceChildren(modalDiv)

    UI.showOverlay()
  }

  static renderPlacementOverlayText(string) {
    const placementTextHeader = document.querySelector('.placement-text')
    placementTextHeader.textContent = string
  }

  static renderEndGameOverlay(announceWinnerString) {
    const modalDiv = document.createElement('div')
    modalDiv.classList.add('modal')

    const mainHeader = document.createElement('h1')
    mainHeader.textContent = announceWinnerString

    const restartBtn = document.createElement('button')
    restartBtn.classList.add('main-btn', 'restart')
    restartBtn.textContent = 'Restart Game'

    modalDiv.append(mainHeader, restartBtn)

    const overlay = document.querySelector('.overlay')
    overlay.appendChild(modalDiv)

    UI.showOverlay()
  }

  // Pregame
  static renderShipOnHover(gameboard, shipLocationArray, isPlacementValid, isPlacementColliding) {
    const overlayBoardCells = document.querySelectorAll('.placement-container .board .cell')

    UI.clearGameboardCells(overlayBoardCells)

    if (isPlacementValid) {
      shipLocationArray.forEach((idx) => {
        overlayBoardCells[idx].classList.add('ship')
      })
    } else if (isPlacementColliding) {
      shipLocationArray.forEach((idx) => {
        overlayBoardCells[idx].classList.add('ship-invalid')
      })
    }

    UI.renderOverlayGameboard(gameboard)
  }

  static initPlacementBoardEventListeners(hoverFn, placementFn) {
    const placementBoard = document.querySelector('.placement-container .board')

    placementBoard.addEventListener('mouseover', (e) => UI.boardEventHandler(e, placementBoard, hoverFn, true))
    placementBoard.addEventListener('click', (e) => UI.boardEventHandler(e, placementBoard, placementFn, true))
  }

  // Buttons
  static rotateBtnEventHandler() {
    const button = document.querySelector('.rotate-btn')

    if (button.getAttribute('data-axis') === 'x') {
      button.setAttribute('data-axis', 'y')
    } else {
      button.setAttribute('data-axis', 'x')
    }
  }

  static initRotateBtnEventListener() {
    const button = document.querySelector('.rotate-btn')

    button.addEventListener('click', UI.rotateBtnEventHandler)
  }

  static initStartButtonEventListener(callbackFn) {
    const button = document.querySelector('.start')

    button.addEventListener('click', callbackFn)
  }

  static toggleStartButtonDisabled() {
    const button = document.querySelector('.start')

    if (button.classList.contains('disabled')) button.classList.remove('disabled')
    else button.classList.add('disabled')
  }

  // Game Sequence
  static initEnemyBoardEventListener(makeMoveFn) {
    const eBoard = document.querySelector('.board.enemy')

    eBoard.addEventListener('click', (e) => UI.boardEventHandler(e, eBoard, makeMoveFn))
  }

  // Game End
  static initRestartGameEventListener(callbackFn) {
    const button = document.querySelector('.restart')

    button.addEventListener('click', callbackFn)
  }
}
