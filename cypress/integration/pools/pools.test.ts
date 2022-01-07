describe('Pools Page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://nodes.pancakeswap.com').as('rpcCall')
    cy.visit('/pools')
  })

  afterEach(() => {
    cy.get('@rpcCall.all').then((res) => {
      cy.task('log', `RPC calls total: ${res.length}`)
      Cypress.log({
        name: 'RPC Calls',
        message: res.length,
      })
    })
  })

  it('loads live pools', () => {
    cy.get('#pools-table').should('be.visible')
  })

  it('loads finished pools', () => {
    cy.get('#finished-pools-button').click()
    cy.get('#pools-table').should('be.visible')
  })
})
