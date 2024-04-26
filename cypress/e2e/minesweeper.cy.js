/// <reference types="Cypress" />

import { TILE_STATUSES } from "../../minesweeper.js"

beforeEach(() => {
  cy.visitBoard([
    [
      { x: 0, y: 0, mine: true, status: TILE_STATUSES.HIDDEN },
      { x: 0, y: 1, mine: true, status: TILE_STATUSES.HIDDEN },
    ],
    [
      { x: 1, y: 0, mine: false, status: TILE_STATUSES.HIDDEN },
      { x: 1, y: 1, mine: false, status: TILE_STATUSES.HIDDEN },
    ],
  ])
})

describe("user left clicks on a tile", () => {
  describe("when the tile is NOT a mine", () => {
    it("reveals itself and displays the number of mines", () => {
      cy.get('[data-x="1"][data-y="1"]')
        .click()
        .get('[data-x="1"][data-y="1"]')
        .should("have.text", "2")
    })
  })

  describe("when the tile IS a mine", () => {
    it("reveals itself and reveals all the other mines", () => {
      // Click on a mine
      cy.get('[data-x="0"][data-y="0"]')
        .click()
        .get('[data-x="0"][data-y="0"]')
        .should("have.attr", "data-status", TILE_STATUSES.MINE)

        // Reveal other mines
        .get('[data-x="0"][data-y="1"]')
        .should("have.attr", "data-status", TILE_STATUSES.MINE)

        // Shows "You lose." legend
        .get(".subtext")
        .should("have.text", "You lose.")

        // Doesn't allow the user to continue clicking
        .get('[data-x="1"][data-y="0"]')
        .should("have.attr", "data-status", TILE_STATUSES.HIDDEN)
    })
  })
})

describe("user right clicks on a tile", () => {
  describe("when the tile is NOT marked", () => {
    it("marks the tile", () => {
      cy.get('[data-x="1"][data-y="1"]')
        .rightclick()
        .get('[data-x="1"][data-y="1"]')
        .should("have.attr", "data-status", TILE_STATUSES.MARKED)
        .get("[data-mine-count]")
        .should("have.text", "1")
    })
  })

  describe("when the tile IS marked", () => {
    it("unmarks the tile", () => {
      cy.get('[data-x="1"][data-y="1"]')
        .rightclick()
        .get('[data-x="1"][data-y="1"]')
        .should("have.attr", "data-status", TILE_STATUSES.MARKED)
        .get("[data-mine-count]")
        .should("have.text", "1")
        .get('[data-x="1"][data-y="1"]')
        .rightclick()
        .get('[data-x="1"][data-y="1"]')
        .should("have.attr", "data-status", TILE_STATUSES.HIDDEN)
        .get("[data-mine-count]")
        .should("have.text", "2")
    })
  })
})
