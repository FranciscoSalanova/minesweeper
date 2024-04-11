// Logic behind the game

export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
}

/** Genera un tablero mediante un array compuesto de arrays que contienen celdas. */
export function createBoard(boardSize, numberOfMines) {
  const board = []
  const minePositions = getMinePositions(boardSize, numberOfMines) // se obtienen las posiciones del tablero donde estarán las minas

  for (let x = 0; x < boardSize; x++) {
    const row = []
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div")
      element.dataset.status = TILE_STATUSES.HIDDEN

      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status
        },
        set status(value) {
          this.element.dataset.status = value
        },
      }
      row.push(tile)
    }
    board.push(row)
  }

  return board
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      )
    })
  })
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => tile.status === TILE_STATUSES.MINE)
  })
}

/** Devuelve un array con las posiciones (x, y) de las minas en la grilla. */
function getMinePositions(boardSize, numberOfMines) {
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

function positionMatch(posA, posB) {
  return posA.x === posB.x && posA.y === posB.y
}

/** Marca la baldosa cliqueada (click derecho). */
export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN
  } else {
    tile.status = TILE_STATUSES.MARKED
  }
}

/** Revela el contenido de la baldosa cliqueada. */
export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) return // ya se hizo algún click

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE
    return
  }

  tile.status = TILE_STATUSES.NUMBER
  const adjacentTiles = nearbyTiles(board, tile)
  const mines = adjacentTiles.filter((tile) => tile.mine)

  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board)) // en caso de no haber minas en las baldosas adyacentes, se ejecuta nuevamente la función para cada celda una de las baldosas
  } else {
    tile.element.textContent = mines.length
    tile.element.style.setProperty("font-size", "1.5rem")
  }
}

/** Devuelve un array con las baldosas adyacentes a la baldosa cliqueada. */
function nearbyTiles(board, { x, y }) {
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset]
      if (tile) tiles.push(tile)
    }
  }

  return tiles
}
