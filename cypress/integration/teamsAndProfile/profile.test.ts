describe('Profile Page', () => {
  it('loads profile creation page', () => {
    cy.visit('/create-profile')
    cy.get('#profile-setup-title').should('be.visible')
  })
})
