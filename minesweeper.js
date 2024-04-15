import { range, times } from "lodash/fp"

export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
}

/** Genera un tablero mediante un array compuesto de arrays que contienen celdas. */
export function createBoard(boardSize, minePositions) {
  return times((x) => {
    return times((y) => {
      return {
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        status: TILE_STATUSES.HIDDEN,
      }
    }, boardSize)
  }, boardSize)
}

export function markedTilesCount(board) {
  return board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    )
  }, 0)
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

export function positionMatch(posA, posB) {
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

  const adjacentTiles = nearbyTiles(board, tile)
  const mines = adjacentTiles.filter((tile) => tile.mine)
  const newBoard = replaceTile(
    board,
    { x, y },
    { ...tile, status: TILE_STATUSES.NUMBER, adjacentMinesCount: mines.length }
  )

  if (mines.length === 0) {
    return adjacentTiles.reduce((b, t) => {
      return revealTile(b, t)
    }, newBoard)
  }

  return newBoard
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
  const offsets = range(-1, 2)

  return offsets
    .flatMap((xOffset) => {
      return offsets.map((yOffset) => {
        return board[x + xOffset]?.[y + yOffset]
      })
    })
    .filter((tile) => tile != null)
}
