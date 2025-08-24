const bcrypt = require('bcryptjs');
const password = 'test123';
const passwordHash = bcrypt.hashSync(password, 10); // hash it like your app

function fillFields(role:String) {
  if (role == 'student' || role == 'alumni') {
    cy.get('input[name="firstName"]').type('First', { force: true });
    cy.get('input[name="lastName"]').type('Last', { force: true });
  }
  if (role == 'sponsor' || role == 'alumni') {
    cy.get('input[name="company"]').type('CompanyName', { force: true });
  }
  cy.get('input[name="email"]').type(`valid${role}@gmail.com`);
  cy.get('input[name="phoneNumber"]').type('1234567890');
  cy.get('input[name="password"]').type('ValidPassword123!');
  cy.get('input[name="confirmPassword"]').type('ValidPassword123!');
  cy.get('input[name="terms"]').check();
}

describe('Tests successful user signup flow', () => {
  it('should sign up a new student user with valid fields filled', () => {
    cy.visit(`/signup/member`);
    cy.task('deleteUsersByEmail', `validstudent@gmail.com`); // delete any existing user with this email
    fillFields('student');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
    // '/verify' is the route for email verification which has not been implemented yet
    // cy.url().should('include', '/verify');
  });

  it('should sign up a new sponsor user with valid fields filled', () => {
    cy.visit(`/signup/sponsor`);
    cy.task('deleteUsersByEmail', `validsponsor@gmail.com`); // delete any existing user with this email
    fillFields('sponsor');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
    // cy.url().should('include', '/verify');
  });

  it('should sign up a new alumni user with valid fields filled', () => {
    cy.visit(`/signup/alumni`);
    cy.task('deleteUsersByEmail', `validalumni@gmail.com`); // delete any existing user with this email
    fillFields('alumni');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
    // cy.url().should('include', '/verify');
  });
})

describe('Tests unsuccessful user signup flow', () => {
  const commonRequiredFields = ['email', 'phoneNumber', 'password', 'confirmPassword'];

  const studentRequiredFields = ['firstName', 'lastName', ...commonRequiredFields];

  const bcrypt = require('bcryptjs');
  const usedEmail = 'usedemail@gmail.com';
  const passwordHash = bcrypt.hashSync('usedpassword', 10);
  //create user in the database same email
  before(() => {
    cy.task('insertTestUser', {
      role: 'student',
      email: usedEmail,
      passwordHash: passwordHash
    }).then((result) => {
      expect(result).to.be.true;
    });
  
    cy.task('findUserByEmail', usedEmail).then((result) => {
      expect(result).to.be.true;
    });
  });

  studentRequiredFields.forEach((field) => {
    it(`should mark field as invalid and prevent submission when the ${field} field is empty`, () => {
      cy.visit(`/signup/member`);
        // fill everything except the currently tested field
        fillFields('student');
        cy.get(`input[name="${field}"]`).clear();
        
        cy.get(`input[name="${field}"]`).then(($input) => {
          const inputElement = $input[0] as HTMLInputElement;
          expect(inputElement.checkValidity()).to.be.false;
        });

        // click submit and check not redirected
        cy.get('button[type="submit"]').click();
        cy.url().should('not.include', '/verify');
    });
  });

  it('should throw a validation error when email is already taken', () => {
    cy.visit(`/signup/member`);
    fillFields('student');
    cy.get(`input[name="email"]`).clear();
    cy.get(`input[name="email"]`).type('validstudent@gmail.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Error: Email already exists').should('be.visible');
  });

})