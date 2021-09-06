describe('Profile Page', () => {
  it('loads profile setup page', () => {
    cy.visit('/profile')
    cy.get('#profile-setup-title').should('be.visible')
  })
})
