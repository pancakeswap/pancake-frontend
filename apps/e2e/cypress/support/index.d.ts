/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * shorthand command for `data-test="<dataTestAttribute>"`
     * @example cy.getBySel('my-element')
     */
    getBySel(dataTestAttribute: string, args?: any): Chainable<Element>
  }
}
