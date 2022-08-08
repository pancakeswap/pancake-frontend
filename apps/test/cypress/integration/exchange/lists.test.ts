describe('Lists', () => {
  beforeEach(() => {
    cy.visit('/swap')
  })

  it('change list', () => {
    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('.list-token-manage-button').click()
  })
})
