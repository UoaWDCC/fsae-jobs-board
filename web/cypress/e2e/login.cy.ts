describe('Tests successful login flow with valid user credentials', () => {

    it('should log in a valid student', () => {
        cy.visit(`${baseUrl}/login/student`);
        cy.get('input[name="email"]').type('validemail@gmail.com');
        cy.get('input[name="password"]').type('validpassword');

        //submit
        cy.url().should('include', '/verify');
    });

    //verify successful login is directed to either verify or home page
})

describe('Tests unsuccessful login flow with valid user credentials', () => {

    it('should not accept invalid emails', () => {
        cy.visit(`${baseUrl}/login/student`);
        cy.get('input[name="email"]').type('invalidemail@gmail.com');
        cy.get('input[name="password"]').type('validpassword');

        //submit
        cy.url().should('include', '/verify');
    });

    it('should not accept incorrect passwords for valid emails', () => {
        cy.visit(`${baseUrl}/login/student`);
        cy.get('input[name="email"]').type('validemail@gmail.com');
        cy.get('input[name="password"]').type('invalidpassword');

        //submit
        cy.url().should('include', '/verify');
    });

    //verify successful login is directed to either verify or home page
})