const baseUrl = 'http://localhost:5173';

function fillFields(role:String) {
  if (role == 'student' || role == 'alumni') {
    cy.get('input[name="firstName"]').type('First');
    cy.get('input[name="lastName"]').type('Last');
  }
  if (role == 'sponsor' || role == 'alumni') {
    cy.get('input[name="company"]').type('CompanyName');
  }
  cy.get('input[name="email"]').type(`valid${role}@gmail.com`);
  cy.get('input[name="phoneNumber"]').type('1234567890');
  cy.get('input[name="password"]').type('ValidPassword123!');
  cy.get('input[name="confirmPassword"]').type('ValidPassword123!');
  cy.get('input[name="terms"]').check();
  cy.get('button[type="submit"]').click();
}

describe('Tests successful user signup flow', () => {
  
  it('should sign up a new student user with valid fields filled', () => {
    cy.visit(`${baseUrl}/signup/student`);
    fillFields('student');
    cy.url().should('include', '/verify');
  });

  it('should sign up a new sponsor user with valid fields filled', () => {
    cy.visit(`${baseUrl}/signup/sponsor`);
    fillFields('sponsor');
    cy.url().should('include', '/verify');
  });

  it('should sign up a new alumni user with valid fields filled', () => {
    cy.visit(`${baseUrl}/signup/alumni`);
    fillFields('alumni');
    cy.url().should('include', '/verify');
  });
})

describe('Tests unsuccessful user signup flow', () => {

  const commonRequiredFields = ['email', 'phoneNumber', 'password', 'confirmPassword'];

  it('should throw a validation error when required fields are not set', () => {
    cy.visit(`${baseUrl}/signup/student`);
    commonRequiredFields.forEach((field) => {
      // fill everything except the currently tested field
      fillFields('student');
      cy.get(`input[name="${field}"]`).clear();
      
      cy.get(`input[name="${field}"]`).then(($input) => {
        const inputElement = $input[0] as HTMLInputElement;
        expect(inputElement.checkValidity()).to.be.false;
      });

      // click submit and check not redirected
      cy.url().should('not.include', '/verify');

    });
  });

  it('should throw a validation error when email is already taken', () => {
    //create user in the database with the same email
    cy.visit(`${baseUrl}/signup/student`);
    fillFields('student');
    cy.get(`input[name="email"]`).clear();
    cy.get(`input[name="email"]`).type('usedemail@gmail.com');
    cy.contains('Error: Email already exists').should('be.visible');
  });

})