import {
  createBoard,
  markedTilesCount,
  TILE_STATUSES,
  markTile,
  revealTile,
  checkLose,
  checkWin,
} from "./minesweeper.js"

const boardSize = 2
const minePositions = [{ x: 0, y: 1 }]

describe("#createBoard", () => {
  test("returns a brand new board", () => {
    const board = createBoard(boardSize, minePositions)
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
    const board = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.MARKED },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
    expect(markedTilesCount(board)).toBe(1)
  })

  test("with no tiles marked", () => {
    const board = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
    expect(markedTilesCount(board)).toBe(0)
  })

  test("with all tiles marked", () => {
    const board = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.MARKED },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.MARKED },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.MARKED },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.MARKED },
      ],
    ]
    expect(markedTilesCount(board)).toBe(4)
  })
})

describe("#markTile", () => {
  test("does nothing in case of being number or being marked", () => {
    const board = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.NUMBER },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
    expect(markTile(board, { x: 0, y: 0 })).toEqual(board)
  })

  test("marks it in case it has not been marked", () => {
    const board = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
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
    const board = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.MARKED },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
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
    expect(markTile(board, { x: 0, y: 0 })).toEqual(expectedBoard)
  })
})

describe("#checkWin", () => {
  test("with only hidden and marked mine tiles it returns true", () => {
    const board = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.NUMBER },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.MARKED },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.NUMBER },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.NUMBER },
      ],
    ]
    expect(checkWin(board)).toBe(true)
  })
})

describe("#checkLose", () => {
  test("returns true in case of a mine is revealed", () => {
    const board = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.MINE },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
    expect(checkLose(board)).toBe(true)
  })
})

describe("#revealTile", () => {
  test("when the status of a tile is not HIDDEN then return the original board", () => {
    const board = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.NUMBER },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
    expect(revealTile(board, { x: 0, y: 0 })).toEqual(board)
  })

  test("when the tile is a mine it set the status to mine", () => {
    const board = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
    const expectedBoard = [
      [
        { x: 0, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 0, y: 1, mine: true, status: TILE_STATUSES.MINE },
      ],
      [
        { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
        { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
      ],
    ]
    expect(revealTile(board, { x: 0, y: 1 })).toEqual(expectedBoard)
  })

  describe("when the tile is not a mine", () => {
    test("when the tile is adyacent to a mine it counts the number of nearby mines", () => {
      const board = [
        [
          { x: 0, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
          { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
        ],
        [
          { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
          { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
        ],
      ]
      const expectedBoard = [
        [
          {
            x: 0,
            y: 0,
            mine: false,
            status: TILE_STATUSES.NUMBER,
            adjacentMinesCount: 1,
          },
          { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
        ],
        [
          { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
          { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
        ],
      ]
      expect(revealTile(board, { x: 0, y: 0 })).toEqual(expectedBoard)
    })

    test("when the tile is not adyacent to a mine it reveals nearby tiles", () => {
      const board = [
        [
          { x: 0, y: 0, mine: true, status: TILE_STATUSES.HIDDEN },
          { x: 0, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
          { x: 0, y: 2, mine: false, status: TILE_STATUSES.HIDDEN },
        ],
        [
          { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
          { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
          { x: 1, y: 2, mine: false, status: TILE_STATUSES.HIDDEN },
        ],
        [
          { x: 2, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
          { x: 2, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
          { x: 2, y: 2, mine: false, status: TILE_STATUSES.HIDDEN },
        ],
      ]
      const expectedBoard = [
        [
          { x: 0, y: 0, mine: true, status: TILE_STATUSES.HIDDEN },
          {
            x: 0,
            y: 1,
            mine: false,
            status: TILE_STATUSES.NUMBER,
            adjacentMinesCount: 1,
          },
          {
            x: 0,
            y: 2,
            mine: false,
            status: TILE_STATUSES.NUMBER,
            adjacentMinesCount: 0,
          },
        ],
        [
          {
            x: 1,
            y: 0,
            mine: false,
            status: TILE_STATUSES.NUMBER,
            adjacentMinesCount: 1,
          },
          {
            x: 1,
            y: 1,
            mine: false,
            status: TILE_STATUSES.NUMBER,
            adjacentMinesCount: 1,
          },
          {
            x: 1,
            y: 2,
            mine: false,
            status: TILE_STATUSES.NUMBER,
            adjacentMinesCount: 0,
          },
        ],
        [
          {
            x: 2,
            y: 0,
            mine: false,
            status: TILE_STATUSES.NUMBER,
            adjacentMinesCount: 0,
          },
          {
            x: 2,
            y: 1,
            mine: false,
            status: TILE_STATUSES.NUMBER,
            adjacentMinesCount: 0,
          },
          {
            x: 2,
            y: 2,
            mine: false,
            status: TILE_STATUSES.NUMBER,
            adjacentMinesCount: 0,
          },
        ],
      ]
      expect(revealTile(board, { x: 2, y: 1 })).toEqual(expectedBoard)
    })
  })
})
