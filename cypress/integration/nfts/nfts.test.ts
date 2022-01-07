// eslint-disable-next-line @typescript-eslint/triple-slash-reference

describe('NFTs Page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://nodes.pancakeswap.com').as('rpcCall')
    cy.visit('/nfts')
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

  it('loads NFTs collections', () => {
    cy.getBySel('nfts-hot-collections').should('be.visible')
    cy.getBySel('hot-collection-card').should('have.length.at.least', 1)
  })

  it('loads newest NFTs', () => {
    cy.getBySel('nfts-newest').should('be.visible')
    cy.getBySel('newest-nft-card').should('have.length.at.least', 10)
  })

  it('shows subgraph health indicator', () => {
    cy.get('#open-settings-dialog-button').click()
    cy.get('#toggle-subgraph-health-button').click({ force: true })
    cy.get(`[role="presentation"]`).click({ force: true })
    cy.getBySel('subgraph-health-indicator').should('be.visible')
  })
})
