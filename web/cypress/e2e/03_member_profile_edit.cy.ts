beforeEach(() => {
  cy.visit('/login');
  cy.get('input[placeholder="Enter email"]').type('validmember@gmail.com');
  cy.get('input[placeholder="Enter password"]').type('ValidPassword123!');
  cy.contains('button', 'Login').click();
  cy.url().should('include', '/profile/member'); // successful login is directed to member profile page
  cy.contains('span', 'Edit Profile').click();
});

describe('Tests successful edits to about me section in member profile', () => {
  it('should save first name locally', () => {
    cy.get('input[name="firstName"]').clear().type('newFirstName');
    cy.get('button[name="profileEditSave"]').click({ force: true }); // force click to bypass toast message
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false; // prevent cypress from failing the test due to unimplemented endpoints
    });

    cy.get('[data-test="fullName"]')
      .invoke('text')
      .then((fullName) => {
        const firstName = fullName.trim().split(' ')[0]; // split by space
        expect(firstName).to.eq('newFirstName');
      });
  });
});
