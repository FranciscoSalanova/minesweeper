// Display/UI of the game

import {
  createBoard,
  markTile,
  TILE_STATUSES,
  revealTile,
  checkWin,
  checkLose,
} from './minesweeper.js'

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

const title = document.querySelector('.title')
title.addEventListener('click', () => {
  window.location.reload() // se puede reiniciar el juego haciendo click en el título "Minesweeper"
})

const boardElement = document.querySelector('.board')
boardElement.style.setProperty('--size', BOARD_SIZE) // mediante la custom property "size" se asigna el tamaño de la grilla
const mineCount = document.querySelector('[data-mine-count]')
mineCount.textContent = NUMBER_OF_MINES

let board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
render()

function render() {
  boardElement.innerHTML = ''
  checkGameEnd()

  getTileElements().forEach((element) => {
    boardElement.append(element)
  })
  listMinesLeft()
}

function getTileElements() {
  return board.flatMap((row) => {
    return row.map(tileToElement)
  })
}

function tileToElement(tile) {
  const element = document.createElement('div')
  element.dataset.status = tile.status
  element.dataset.x = tile.x
  element.dataset.y = tile.y
  element.textContent = tile.adjacentMinesCount || ''

  return element
}

boardElement.addEventListener('click', (e) => {
  if (!e.target.matches('[data-status]')) return

  board = revealTile(board, {
    x: parseInt(e.target.dataset.x),
    y: parseInt(e.target.dataset.y),
  })

  render()
})

boardElement.addEventListener('contextmenu', (e) => {
  if (!e.target.matches('[data-status]')) return

  e.preventDefault()

  board = markTile(board, {
    x: parseInt(e.target.dataset.x),
    y: parseInt(e.target.dataset.y),
  })

  render()
})

/** Decrementa la cantidad de minas inicial a partir de la cantidad de celdas marcadas como sospechosas de contener una mina. */
function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    )
  }, 0)

  mineCount.textContent = NUMBER_OF_MINES - markedTilesCount
}

const messageText = document.querySelector('.subtext')

/** Función que maneja lo que debe pasar cuando finaliza el juego, sea que el jugador haya ganado o haya perdido. */
function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener('click', stopPropagation, { capture: true })
    boardElement.addEventListener('contextmenu', stopPropagation, {
      capture: true,
    })
  }

  if (win) {
    messageText.textContent = 'You Won!!!'
  }
  if (lose) {
    messageText.textContent = 'You lose.'
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
    setTimeout(() => {
      window.location.reload()
    }, 10000)
  }
}

/** Interrumpa la propagación de eventos para evitar que el jugador pueda hacer click izquierdo o derecho luego de haber ganado o perdido. */
function stopPropagation(e) {
  e.stopImmediatePropagation()
}
