import { TEST_ADDRESS_NEVER_USE, TEST_ADDRESS_NEVER_USE_SHORTENED } from '../../support/commands'

describe('Home Page', () => {
  beforeEach(() => cy.visit('/'))
  it('loads home page', () => {
    cy.get('#homepage-hero')
  })

  it('connected wallet is displayed properly', () => {
    cy.get('nav')
      .first()
      .find('div')
      .last()
      .get(`[title=${TEST_ADDRESS_NEVER_USE}]`)
      .contains(TEST_ADDRESS_NEVER_USE_SHORTENED)
  })
})
