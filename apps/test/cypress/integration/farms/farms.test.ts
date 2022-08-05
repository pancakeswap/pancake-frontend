describe('Farms Page', () => {
  it('loads live farms', () => {
    cy.visit('/farms')
    cy.get('#farms-table').should('be.visible')
  })

  it('loads finished farms', () => {
    cy.visit('/farms/history')
    cy.get('#staked-only-farms').click({ force: true })
    cy.get('body').then((body) => {
      if (body.find('#farms-table').length > 0) {
        cy.get('#farms-table').children('#table-container').should('be.visible')
      }
    })
  })
})
