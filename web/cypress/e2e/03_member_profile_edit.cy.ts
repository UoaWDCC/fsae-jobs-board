beforeEach(() => {
  cy.visit('/login');
  cy.get('input[placeholder="Enter email"]').type('validmember@gmail.com');
  cy.get('input[placeholder="Enter password"]').type('ValidPassword123!');
  cy.contains('button', 'Login').click();
  cy.url().should('include', '/profile/member'); // successful login is directed to member profile page
  cy.contains('span', 'Edit Profile').click();
});

describe('Tests successful edits to about me section in member profile', () => {
  const nameFields = [
    { field: 'first', position: 0 },
    { field: 'last', position: 1 },
  ];
  // Testing ability to edit first and last name in the about me section
  nameFields.forEach(({ field, position }) => {
    it(`should save ${field} name locally`, () => {
      cy.get(`input[name="${field}Name"]`).clear().type(`new${field}Name`);
      cy.get('button[name="profileEditSave"]').click({ force: true }); // force click to bypass toast message
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // prevent cypress from failing the test due to unimplemented endpoints
      });

      cy.get('[data-test="fullName"]')
        .invoke('text')
        .then((fullName) => {
          const name = fullName.trim().split(' ')[position]; // split by space
          expect(name).to.eq(`new${field}Name`);
        });
    });
  });
});
