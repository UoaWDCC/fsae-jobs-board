beforeEach(() => {
  cy.visit('/login');
  cy.get('input[placeholder="Enter email"]').type('validmember@gmail.com');
  cy.get('input[placeholder="Enter password"]').type('ValidPassword123!');
  cy.contains('button', 'Login').click();

  // successful login is directed to member profile page
  cy.url().should('include', '/profile/member');
});



