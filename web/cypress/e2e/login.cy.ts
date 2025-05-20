describe('Tests successful login flow with valid user credentials', () => {
    const roles = ['member', 'alumni'];
    roles.forEach((role) => {
      it(`should log in a valid ${role}`, () => {
        cy.visit(`/login`);
        cy.get('input[placeholder="Enter email"]').type(`valid${role}@gmail.com`);
        cy.get('input[placeholder="Enter password"]').type('ValidPassword123!');

        //submit and verify successful login is directed to either verify or home page
        cy.contains('button', 'Login').click();
        cy.url().should('match', /\/(verify|profile)/);
      });
    });  

})

describe('Tests unsuccessful login flow with valid user credentials', () => {
    it('should not accept invalid emails', () => {
        cy.visit(`/login`);
        cy.task('deleteUsersByEmail', 'invalidemail@gmail.com');
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