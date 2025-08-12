beforeEach(() => {
  cy.visit('/login');
  cy.get('input[placeholder="Enter email"]').type('validmember@gmail.com');
  cy.get('input[placeholder="Enter password"]').type('ValidPassword123!');
  cy.contains('button', 'Login').click();
  cy.url().should('include', '/profile/member'); // successful login is directed to member profile page
});

describe('Tests successful edits to about me section in member profile', () => {
  const nameFields = [
    { field: 'first', position: 0 },
    { field: 'last', position: 1 },
  ];
  // Testing ability to edit first and last name in the about me section
  nameFields.forEach(({ field, position }) => {
    it(`should save ${field} name locally`, () => {
      cy.contains('span', 'Edit Profile').click();
      cy.get(`input[name="${field}Name"]`).clear().type(`new${field}Name`);
      cy.get('button[name="profileEditSave"]').click({ force: true }); // force click to bypass toast message
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // prevent cypress from failing the test due to unimplemented endpoints
      });

      cy.get('[data-test="fullName"]')
        .invoke('text')
        .then((fullName) => {
          const name = fullName.trim().split(' ')[position];
          expect(name).to.eq(`new${field}Name`);
        });
    });
  });

  const aboutFields = [
    { id: 'email', name: 'email address', newName: 'newemail@gmail.com', method: 'input' },
    { id: 'phoneNumber', name: 'phone number', newName: '1234567890', method: 'input' },
    // Test cases for subgroup and job type are commented out as they are not implemented yet
    // { id:'subGroup', name: 'subgroup', newName: 'NewSubGroup', method: 'input' },
    // { id:'jobType', name: 'job type', newName: 'NewRole', method: 'input' },
    {
      id: 'aboutMe',
      name: 'about me',
      newName: 'This is a new about me section.',
      method: 'textarea',
    },
  ];
  // Testing ability to edit email, phone number, subgroup, and looking for fields in the about me section
  aboutFields.forEach(({ id, name, newName, method }) => {
    it(`should save ${name} locally`, () => {
      cy.contains('span', 'Edit Profile').click();
      cy.get(`${method}[name="${id}"]`).clear().type(newName);
      cy.get('button[name="profileEditSave"]').click({ force: true });
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // prevent cypress from failing the test due to unimplemented endpoints
      });
      cy.get(`p[data-test="${id}"]`).should('contains.text', newName);
    });
  });
});

describe('Tests successful edits to education section in member profile', () => {
  it('should add a new education entry locally', () => {
    let initialEducationCount = 0;
    cy.get('button[data-test="showMoreEducation"]').click();
    cy.get('div[data-test="educationContainer"]') // replace with your selector for the container
      .children()
      .its('length')
      .then((count: number) => {
        initialEducationCount = count;
        cy.contains('span', 'Edit Profile').click();
        cy.get('button[data-test="educationTabEditButton"]').click();
        cy.get('input[name="university"]').type('NewUniversity');
        cy.get('input[name="degree"]').type('NewDegree');
        cy.get('input[name="majors"]').type('NewMajors');
        cy.get('input[name="graduationYear"]').type('2025');
        cy.get('button[name="profileEditSave"]').click({ force: true });
        Cypress.on('uncaught:exception', (err, runnable) => {
          return false; // prevent cypress from failing the test due to unimplemented endpoints
        });
        cy.get('div[data-test="educationContainer"]')
          .children()
          .its('length')
          .should('eq', initialEducationCount + 2);
      });
  });
});

describe('Tests successful edits to skills section in member profile', () => {
  it('should add a new skill locally', () => {
    let initialSkillsCount = 0;
    cy.get('button[data-test="viewMoreSkills"]').click();
    cy.get('div[data-test="skillsContainer"]') // replace with your selector for the container
      .children()
      .its('length')
      .then((count: number) => {
        initialSkillsCount = count;
        cy.contains('span', 'Edit Profile').click();
        cy.get('button[data-test="skillsTabEditButton"]').click();
        cy.get('input[name="skills"]').type('NewSkill');
        cy.get('button[name="addSkill"]').click();
        cy.get('button[name="profileEditSave"]').click({ force: true });
        Cypress.on('uncaught:exception', (err, runnable) => {
          return false; // prevent cypress from failing the test due to unimplemented endpoints
        });
        cy.get('div[data-test="skillsContainer"]')
          .children()
          .its('length')
          .should('eq', initialSkillsCount + 1);
      });
  });
});
