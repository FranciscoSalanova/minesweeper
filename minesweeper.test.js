import {
  createBoard,
  markedTilesCount,
  TILE_STATUSES,
  markTile,
  revealTile,
  checkLose,
  checkWin,
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

  test("with all tiles marked", () => {
    const expectedBoard = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.MARKED },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.MARKED },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.MARKED },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.MARKED },
      ],
    ]
    expect(markedTilesCount(expectedBoard)).toBe(4)
  })
})

describe("#markTile", () => {
  test("unmarks it in case of already been marked", () => {
    const expectedBoard = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.MARKED },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
    expect(markTile(board, { x: 0, y: 0 })).toEqual(expectedBoard)
  })

  test("unmarks it in case of already been marked", () => {
    const expectedBoard = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.NUMBER },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
    expect(markTile(expectedBoard, { x: 0, y: 0 })).toEqual(expectedBoard)
  })
})

describe("#checkWin", () => {
  test("returns true in case all tiles with mines where marked and the rest of tiles were revealed", () => {
    const expectedBoard = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.NUMBER },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.MARKED },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.NUMBER },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.NUMBER },
      ],
    ]
    expect(checkWin(expectedBoard)).toBe(true)
  })
})

describe("#checkLose", () => {
  test("returns true in case of a mine is revealed", () => {
    const expectedBoard = revealTile(board, { x: 0, y: 1 })
    expect(checkLose(expectedBoard)).toBe(true)
  })
})
