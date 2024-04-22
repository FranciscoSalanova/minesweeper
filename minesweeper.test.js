import {
  createBoard,
  markedTilesCount,
  TILE_STATUSES,
  markTile,
} from "./minesweeper.js"

// Tablero base para ejecutar las pruebas unitarias
const boardSize = 2
const minePositions = [{ x: 0, y: 1 }]
const board = createBoard(boardSize, minePositions)

describe("#createBoard", () => {
  test("returns a brand new board", () => {
    const expectedBoard = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
    expect(board).toEqual(expectedBoard)
  })
})

describe("#markedTilesCount", () => {
  test("returns the count of marked tiles on the board", () => {
    expect(markedTilesCount(markTile(board, { x: 0, y: 0 }))).toBe(1)
  })

  test("with no tiles marked", () => {
    expect(markedTilesCount(board)).toBe(0)
  })
})
