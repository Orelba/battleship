(()=>{"use strict";const e=e=>{if("number"!=typeof e)throw new Error("You must pass a number as the length argument to Ship()");if(e<2||e>6)throw new Error("Ship length must be between 2 to 6");return{length:e,hitCount:0,hit(){this.hitCount+=1},isSunk(){return this.hitCount>=this.length}}},t=()=>{const e=new Array(100).fill().map((()=>({hasShip:!1,isShot:!1}))),t=e=>{const t=e.toString();let a,r;return 1===t.length?(r=Number(t[0]),a=0):(a=Number(t[0]),r=Number(t[1])),[a,r]},a=(e,t,a)=>{const r=[];for(let n=0;n<e.length;n+=1)"x"===a?r.push(t+n):r.push(t+10*n);return r},r=e=>{const a=new Set,r=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];for(let n=0;n<e.length;n+=1){const o=t(e[n]);for(let e=0;e<r.length;e+=1){const t=r[e][0]+o[0],n=r[e][1]+o[1],s=9;t<0||t>s||n<0||n>s||a.add(Number([t,n].join("")))}}return a.forEach((t=>{e.includes(t)&&a.delete(t)})),Array.from(a)},n=t=>!t.some((t=>!e[t]))&&!t.some((t=>e[t].hasShip))&&![9,19,29,39,49,59,69,79,89].some((e=>[e,e+1].every((e=>t.includes(e))))),o=(t,o,s)=>{const c=a(t,o,s),l=r(c);return!(!n(c)||(d=l,d.some((t=>e[t].hasShip))));var d},s=(t,r,n="x")=>{const s=a(t,r,n);if(!o(t,r,n))throw new Error(`Placement of ship of length ${t.length} at index ${r} on axis ${n.toUpperCase()} is not valid.`);return s.forEach((a=>{e[a].hasShip=t})),!0},c=t=>!!e[t].hasShip;return{board:e,createLocationArray:a,getNeighborArray:r,checkCollisions:n,isPlacementValid:o,placeShip:s,placeShipInRandomLocation:e=>{let t=99,a="x";for(;!o(e,t,a);)t=Math.floor(98*Math.random()),a=Math.random()>.5?"x":"y";s(e,t,a)},checkIfShotHit:c,receiveAttack:t=>{c(t)&&e[t].hasShip.hit(),e[t].isShot=!0},isGameOver:()=>{const t=new Set;let a=0;return e.forEach((e=>{e.hasShip&&t.add(e.hasShip)})),t.forEach((e=>{e.isSunk()&&(a+=1)})),t.size===a}}},a=e=>{const t=(e,t)=>!t.board[e].isShot&&(t.receiveAttack(e),!0);return{name:e,attack:t,makeRandomAttack:e=>{const a=(r=e.board.reduce(((e,t,a)=>(t.isShot||e.push(a),e)),[]))[Math.floor(Math.random()*r.length)];var r;return t(a,e)}}};class r{static loadGameBoards(){const e=document.querySelector(".board.friendly"),t=document.querySelector(".board.enemy");r.renderGridCells(e),r.renderGridCells(t)}static renderGridCells(e){const t=e.querySelector(".board-overlay");for(let a=0;a<100;a+=1){const a=document.createElement("div");a.classList.add("cell"),e.insertBefore(a,t)}}static renderShipCell(e){e.classList.add("ship")}static renderHit(e){const t=document.createElement("img");t.src="./images/hit.png",t.height=35,t.width=35,e.appendChild(t),e.classList.add("hit")}static renderMiss(e){const t=document.createElement("div");t.classList.add("dot"),e.classList.add("miss"),e.appendChild(t)}static clearGameboardCells(e){e.forEach((e=>{e.classList.remove("ship","ship-invalid","hit","miss"),e.replaceChildren()}))}static clearAllGameboardCells(){const e=document.querySelectorAll(".board.friendly .cell"),t=document.querySelectorAll(".board.enemy .cell");r.clearGameboardCells(e),r.clearGameboardCells(t)}static renderPlayerGameboard(e){const t=document.querySelectorAll(".board.friendly .cell");r.clearGameboardCells(t),e.board.forEach(((e,a)=>{e.hasShip&&e.isShot?r.renderHit(t[a]):e.hasShip&&!e.isShot?r.renderShipCell(t[a]):!e.hasShip&&e.isShot&&r.renderMiss(t[a])}))}static renderEnemyGameboard(e){const t=document.querySelectorAll(".board.enemy .cell");r.clearGameboardCells(t),e.board.forEach(((e,a)=>{e.hasShip&&e.isShot?r.renderHit(t[a]):!e.hasShip&&e.isShot&&r.renderMiss(t[a])}))}static addDarkBoardOverlay(e){const t=document.querySelector(".board.friendly .board-overlay"),a=document.querySelector(".board.enemy .board-overlay");"player"===e?t.classList.add("darken"):"enemy"===e&&a.classList.add("darken")}static removeDarkBoardOverlay(e){const t=document.querySelector(".board.friendly .board-overlay"),a=document.querySelector(".board.enemy .board-overlay");"player"===e?t.classList.remove("darken"):"enemy"===e&&a.classList.remove("darken")}static boardEventHandler(e,t,a,r=!1){const n=e.target,o=Array.prototype.indexOf.call(t.children,n);n.classList.contains("cell")&&(r?a(o,document.querySelector(".rotate-btn").getAttribute("data-axis")):a(o))}static renderOverlayGameboard(e){const t=document.querySelectorAll(".placement-container .board .cell");e.board.forEach(((e,a)=>{e.hasShip&&r.renderShipCell(t[a])}))}static showOverlay(){document.querySelector(".overlay").classList.add("show")}static clearOverlay(){document.querySelector(".overlay").replaceChildren()}static hideOverlay(){document.querySelector(".overlay").classList.remove("show"),r.clearOverlay()}static renderPlacementOverlay(){const e=document.createElement("div");e.classList.add("modal");const t=document.createElement("h1");t.textContent="Welcome to the battle";const a=document.createElement("h2");a.classList.add("placement-text"),a.textContent="Place Your Carrier";const n=document.createElement("div");n.classList.add("placement-container");const o=document.createElement("button");o.classList.add("rotate-btn"),o.setAttribute("data-axis","x");const s=document.createElement("span");s.textContent="Rotate";const c=document.createElement("img");c.src="images/rotate.svg",c.width=15,c.height=15,o.append(s,c);const l=document.createElement("div");l.classList.add("board"),r.renderGridCells(l),n.append(o,l);const d=document.createElement("button");d.classList.add("main-btn","start","disabled"),d.textContent="Start Game",e.append(t,a,n,d),document.querySelector(".overlay").replaceChildren(e),r.showOverlay()}static renderPlacementOverlayText(e){document.querySelector(".placement-text").textContent=e}static renderEndGameOverlay(e){const t=document.createElement("div");t.classList.add("modal");const a=document.createElement("h1");a.textContent=e;const n=document.createElement("button");n.classList.add("main-btn","restart"),n.textContent="Restart Game",t.append(a,n),document.querySelector(".overlay").appendChild(t),r.showOverlay()}static renderShipOnHover(e,t,a,n){const o=document.querySelectorAll(".placement-container .board .cell");r.clearGameboardCells(o),a?t.forEach((e=>{o[e].classList.add("ship")})):n&&t.forEach((e=>{o[e].classList.add("ship-invalid")})),r.renderOverlayGameboard(e)}static initPlacementBoardEventListeners(e,t){const a=document.querySelector(".placement-container .board");a.addEventListener("mouseover",(t=>r.boardEventHandler(t,a,e,!0))),a.addEventListener("click",(e=>r.boardEventHandler(e,a,t,!0)))}static rotateBtnEventHandler(){const e=document.querySelector(".rotate-btn");"x"===e.getAttribute("data-axis")?e.setAttribute("data-axis","y"):e.setAttribute("data-axis","x")}static initRotateBtnEventListener(){document.querySelector(".rotate-btn").addEventListener("click",r.rotateBtnEventHandler)}static initStartButtonEventListener(e){document.querySelector(".start").addEventListener("click",e)}static toggleStartButtonDisabled(){const e=document.querySelector(".start");e.classList.contains("disabled")?e.classList.remove("disabled"):e.classList.add("disabled")}static initEnemyBoardEventListener(e){const t=document.querySelector(".board.enemy");t.addEventListener("click",(a=>r.boardEventHandler(a,t,e)))}static initRestartGameEventListener(e){document.querySelector(".restart").addEventListener("click",e)}}class n{static player=a("Friendly");static enemy=a("Enemy");static playerBoard=t();static enemyBoard=t();static takesTurn="Player";static placementBoard=t();static ships=[["Carrier",e(5)],["Battleship",e(4)],["Destroyer",e(3)],["Submarine",e(3)],["Patrol Boat",e(2)]];static currShip=n.ships[0];static isPlacementDone=!1;static init(){r.loadGameBoards(),n.pregameOverlay(),r.initEnemyBoardEventListener(n.makePlayerMove)}static restart(){n.resetState(),r.clearAllGameboardCells(),n.pregameOverlay()}static setupEnemyBoard(){const t=e(5),a=e(4),r=e(3),o=e(3),s=e(2);n.enemyBoard.placeShipInRandomLocation(t),n.enemyBoard.placeShipInRandomLocation(a),n.enemyBoard.placeShipInRandomLocation(r),n.enemyBoard.placeShipInRandomLocation(o),n.enemyBoard.placeShipInRandomLocation(s)}static hoverOnPlacementBoard(e,t){if(!n.isPlacementDone){const a=n.placementBoard.createLocationArray(n.currShip[1],e,t),o=n.placementBoard.isPlacementValid(n.currShip[1],e,t),s=n.placementBoard.checkCollisions(a);r.renderShipOnHover(n.placementBoard,a,o,s)}}static placeOnPlacementBoard(e,t){const a=n.ships.indexOf(n.currShip),o=a+1;a>4||-1===a||n.placementBoard.isPlacementValid(n.currShip[1],e,t)&&(n.placementBoard.placeShip(n.currShip[1],e,t),n.currShip=n.ships[o],r.renderOverlayGameboard(n.placementBoard),a<4&&r.renderPlacementOverlayText(`Place Your ${n.currShip[0]}`),o>4&&(n.isPlacementDone=!0,r.renderPlacementOverlayText("Get Ready..."),r.toggleStartButtonDisabled(),r.initStartButtonEventListener(n.start)))}static pregameOverlay(){r.renderPlacementOverlay(),r.initRotateBtnEventListener(),r.initPlacementBoardEventListeners(n.hoverOnPlacementBoard,n.placeOnPlacementBoard),r.initStartButtonEventListener()}static start(){n.playerBoard.board=Object.assign(n.playerBoard.board,n.placementBoard.board),n.setupEnemyBoard(),r.clearAllGameboardCells(),r.hideOverlay(),r.renderPlayerGameboard(n.playerBoard),r.renderEnemyGameboard(n.enemyBoard),r.addDarkBoardOverlay("player")}static resetState(){n.playerBoard=t(),n.enemyBoard=t(),n.placementBoard=t(),n.takesTurn="Player",n.ships[0][1]=e(5),n.ships[1][1]=e(4),n.ships[2][1]=e(3),n.ships[3][1]=e(3),n.ships[4][1]=e(2),n.currShip=n.ships[0],n.isPlacementDone=!1}static end(e){r.removeDarkBoardOverlay("player"),r.removeDarkBoardOverlay("enemy"),r.renderEndGameOverlay(e),r.initRestartGameEventListener(n.restart)}static makeEnemyMove(){n.enemy.makeRandomAttack(n.playerBoard),r.renderPlayerGameboard(n.playerBoard),n.playerBoard.isGameOver()?n.end("Enemy Wins!"):(n.takesTurn="Player",r.addDarkBoardOverlay("player"),r.removeDarkBoardOverlay("enemy"))}static async makePlayerMove(e){"Player"!==n.takesTurn||n.enemyBoard.board[e].isShot||(n.player.attack(e,n.enemyBoard),r.renderEnemyGameboard(n.enemyBoard),n.enemyBoard.isGameOver()?n.end("You Win!"):(n.takesTurn="Enemy",r.addDarkBoardOverlay("enemy"),r.removeDarkBoardOverlay("player"),await n.sleepRandomTimeBetween(300,600),n.makeEnemyMove()))}static sleepRandomTimeBetween(e,t){const a=Math.floor(Math.random()*(t-e+1)+e);return new Promise((e=>{setTimeout(e,a)}))}}document.addEventListener("DOMContentLoaded",n.init)})();
//# sourceMappingURL=main.js.map