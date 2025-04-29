describe ('Tests user signup flow', () => {
  const baseUrl = 'http://localhost:5173';
  it('should sign up a new student user', () => {
    cy.visit(`${baseUrl}/signup/student`);
    cy.get('input[name="firstName"]').type('Valid');
    cy.get('input[name="lastName"]').type('Student');
    cy.get('input[name="email"]').type('validstudentuser@gmail.com');
    cy.get('input[name="phoneNumber"]').type('1234567890');
    cy.get('input[name="password"]').type('ValidPassword123!');
    cy.get('input[name="confirmPassword"]').type('ValidPassword123!');
    cy.get('input[name="terms"]').check();
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/verify');
  });

})