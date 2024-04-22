import {
  createBoard,
  markTile,
  TILE_STATUSES,
  revealTile,
  checkWin,
  checkLose,
  positionMatch,
  markedTilesCount,
} from "./minesweeper.js"

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 1

const title = document.querySelector(".title")
title.addEventListener("click", () => {
  window.location.reload()
})

const boardElement = document.querySelector(".board")
boardElement.style.setProperty("--size", BOARD_SIZE)
const mineCount = document.querySelector("[data-mine-count]")
mineCount.textContent = NUMBER_OF_MINES

let board = createBoard(
  BOARD_SIZE,
  getMinePositions(BOARD_SIZE, NUMBER_OF_MINES)
)
render()

/** Renderiza un nuevo tablero cada vez que haya que mostrar un cambio en el juego. */
function render() {
  boardElement.innerHTML = ""
  checkGameEnd()

  getTileElements().forEach((element) => {
    boardElement.append(element)
  })
  listMinesLeft()
}

/** Devuelve un array con todas los datos de todas las baldosas a mostrar en el tablero. */
function getTileElements() {
  return board.flatMap((row) => {
    return row.map(tileToElement)
  })
}

/** Devuelve un div que representa una baldosa en el tablero. */
function tileToElement(tile) {
  const element = document.createElement("div")
  element.dataset.status = tile.status
  element.dataset.x = tile.x
  element.dataset.y = tile.y
  element.textContent = tile.adjacentMinesCount || ""

  return element
}

boardElement.addEventListener("click", (e) => {
  if (!e.target.matches("[data-status]")) return

  board = revealTile(board, {
    x: parseInt(e.target.dataset.x),
    y: parseInt(e.target.dataset.y),
  })

  render()
})

boardElement.addEventListener("contextmenu", (e) => {
  if (!e.target.matches("[data-status]")) return

  e.preventDefault()

  board = markTile(board, {
    x: parseInt(e.target.dataset.x),
    y: parseInt(e.target.dataset.y),
  })

  render()
})

/** Decrementa la cantidad de minas inicial a partir de la cantidad de celdas marcadas como sospechosas de contener una mina. */
function listMinesLeft() {
  mineCount.textContent = NUMBER_OF_MINES - markedTilesCount(board)
}

const messageText = document.querySelector(".subtext")

/** Función que maneja lo que debe pasar cuando finaliza el juego, sea que el jugador haya ganado o haya perdido. */
function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener("click", stopPropagation, { capture: true })
    boardElement.addEventListener("contextmenu", stopPropagation, {
      capture: true,
    })
  }

  if (win) {
    messageText.textContent = "You Won!!!"
  }
  if (lose) {
    messageText.textContent = "You lose."
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) {
          return (board = markTile(board, tile))
        }
        if (tile.mine) {
          return (board = revealTile(board, tile))
        }
      })
    })
    setTimeout(() => {
      window.location.reload()
    }, 10000)
  }
}

/** Interrumpe la propagación de eventos para evitar que el jugador pueda hacer click izquierdo o derecho luego de haber ganado o perdido. */
function stopPropagation(e) {
  e.stopImmediatePropagation()
}

/** Devuelve un array con las posiciones (x, y) de las minas en la grilla. */
export function getMinePositions(boardSize, numberOfMines) {
  const positions = []

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    }

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position)
    }
  }

  return positions
}

/** Genera un número aleatorio para la determinación de una coordenada de una mina. */
function randomNumber(size) {
  return Math.floor(Math.random() * size)
}
