describe('Pool', () => {
  beforeEach(() => cy.visit('/liquidity'))
  it('add liquidity links to /add/', () => {
    cy.get('#join-pool-button').click()
    cy.url().should('contain', '/add')
  })

  it('redirects /pool to /liquidity', () => {
    cy.visit('/pool')
    cy.url().should('contain', '/liquidity')
  })

  it('import pool links to /find', () => {
    cy.get('#import-pool-link', { timeout: 20000 }).click()
    cy.url().should('contain', '/find')
  })
})
