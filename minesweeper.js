// Logic behind the game

export const TILE_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked',
}

/** Genera un tablero mediante un array compuesto de arrays que contienen celdas. */
export function createBoard(boardSize, numberOfMines) {
  const board = []
  const minePositions = getMinePositions(boardSize, numberOfMines) // se obtienen las posiciones del tablero donde estarán las minas

  for (let x = 0; x < boardSize; x++) {
    const row = []
    for (let y = 0; y < boardSize; y++) {
      const tile = {
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        status: TILE_STATUSES.HIDDEN,
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
export function markTile(board, { x, y }) {
  const tile = board[x][y]

  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return board
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    return replaceTile(
      board,
      { x, y },
      { ...tile, status: TILE_STATUSES.HIDDEN }
    )
  } else {
    return replaceTile(
      board,
      { x, y },
      { ...tile, status: TILE_STATUSES.MARKED }
    )
  }
}

/** Revela el contenido de la baldosa cliqueada. */
export function revealTile(board, { x, y }) {
  const tile = board[x][y]

  if (tile.status !== TILE_STATUSES.HIDDEN) return board

  if (tile.mine) {
    return replaceTile(board, { x, y }, { ...tile, status: TILE_STATUSES.MINE })
  }

  tile.status = TILE_STATUSES.NUMBER
  const adjacentTiles = nearbyTiles(board, tile)
  const mines = adjacentTiles.filter((tile) => tile.mine)

  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board)) // en caso de no haber minas en las baldosas adyacentes, se ejecuta nuevamente la función para cada celda una de las baldosas
  } else {
    tile.element.textContent = mines.length
    tile.element.style.setProperty('font-size', '1.5rem')
  }
}

/** Devuelve una nueva baldosa que incluye la modificación de estado. */
function replaceTile(board, position, newTile) {
  return board.map((row, x) => {
    return row.map((tile, y) => {
      if (positionMatch(position, { x, y })) {
        return newTile
      }
      return tile
    })
  })
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
