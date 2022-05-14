describe('Header', () => {
  beforeEach(() => cy.visit('/'))

  it('can open settings modal', () => {
    cy.get(`[data-cy='settingsButton']`).click()
    cy.get(`[data-cy='settingsModal']`).should('be.visible')
  })

  it('can open language settings', () => {
    cy.get(`[data-cy='languageSelector']`).first().click()
    cy.get(`[data-cy='dropdownList']`).should('be.visible')
  })
})
