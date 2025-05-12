const bcrypt1 = require('bcryptjs');
const existingEmail = 'validemail@gmail.com';
const existingPasswordHash = bcrypt1.hashSync('validpassword', 10);

function createUser(role:String) {
    cy.task('insertTestUser', {
        role: role,
        email: existingEmail,
        passwordHash: existingPasswordHash
      }).then((result) => {
        expect(result).to.be.true;
      });
    
      cy.task('findUserByEmail', existingEmail).then((result) => {
        expect(result).to.be.true;
      });
}

describe('Tests successful login flow with valid user credentials', () => {
    before(() => {
        createUser('student');
      });
    
    it('should log in a valid student', () => {
        cy.visit(`/login`);
        cy.get('input[placeholder="Enter email"]').type('validemail@gmail.com');
        cy.get('input[placeholder="Enter password"]').type('validpassword');

        //submit and verify successful login is directed to either verify or home page
        cy.contains('button', 'Login').click();
        cy.url().should('match', /\/(verify|profile)/);
    });

})

describe('Tests unsuccessful login flow with valid user credentials', () => {
    it('should not accept invalid emails', () => {
        cy.visit(`/login`);
        cy.get('input[placeholder="Enter email"]').type('invalidemail@gmail.com');
        cy.get('input[placeholder="Enter password"]').type('validpassword');

        //submit
        cy.contains('button', 'Login').click();
        cy.contains('Invalid credentials').should('be.visible');
    });

    it('should not accept incorrect passwords for valid emails', () => {
        cy.visit(`/login`);
        cy.get('input[placeholder="Enter email"]').type('validemail@gmail.com');
        cy.get('input[placeholder="Enter password"]').type('invalidpassword');

        //submit
        cy.contains('button', 'Login').click();
        cy.contains('Invalid credentials').should('be.visible');
    });
})