describe('Teams Leaderboard Page', () => {
  it('loads teams leaderboard page', () => {
    cy.visit('/teams')
    cy.get('#team-1').should('be.visible')
    cy.get('#team-2').should('be.visible')
    cy.get('#team-3').should('be.visible')
  })
})
