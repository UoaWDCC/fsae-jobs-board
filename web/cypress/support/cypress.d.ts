declare namespace Cypress {
  interface Chainable<Subject = any> {
    makeApiRequest(method: string, url: string): Chainable<any>;
  }
}