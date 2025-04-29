describe ('Tests user signup flow', () => {
  const baseUrl = 'http://localhost:5173';
  
  it('should sign up a new student user with valid fields filled', () => {
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

  it('should sign up a new sponsor user with valid fields filled', () => {
    cy.visit(`${baseUrl}/signup/sponsor`);
    cy.get('input[name="company"]').type('CompanyName');
    cy.get('input[name="email"]').type('validsponsoruser@gmail.com');
    cy.get('input[name="phoneNumber"]').type('2345678901');
    cy.get('input[name="password"]').type('ValidPassword1234!');
    cy.get('input[name="confirmPassword"]').type('ValidPassword1234!');
    cy.get('input[name="terms"]').check();
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/verify');
  });

  it('should sign up a new alumni user with valid fields filled', () => {
    cy.visit(`${baseUrl}/signup/alumni`);
    cy.get('input[name="firstName"]').type('Valid', {force: true});
    cy.get('input[name="lastName"]').type('Alumni');
    cy.get('input[name="company"]').type('CompanyName');
    cy.get('input[name="email"]').type('validalumniuser@gmail.com');
    cy.get('input[name="phoneNumber"]').type('3456789012');
    cy.get('input[name="password"]').type('ValidPassword12345!');
    cy.get('input[name="confirmPassword"]').type('ValidPassword12345!');
    cy.get('input[name="terms"]').check();
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/verify');
  });

})