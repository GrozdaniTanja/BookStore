describe("Registration Tests", () => {
  let users;

  beforeEach(() => {
    cy.fixture("fixtures").then((data) => {
      users = {
        ...data,
        successfulRegistration: {
          ...data.successfulRegistration,
          email: `testuser${Date.now()}@gmail.com`,
          username: `testuser${Date.now()}`,
        },
        unsuccessfulRegistration: {
          ...data.unsuccessfulRegistration,
          email: `admin${Date.now()}@bookstore.com`,
          username: `admin${Date.now()}`,
        },
      };
    });

    cy.visit("auth/register");
  });

  it("Successful registration", () => {
    cy.get('input[name="username"]').type(
      users.successfulRegistration.username
    );
    cy.get('input[name="firstName"]').type(
      users.successfulRegistration.firstName
    );
    cy.get('input[name="lastName"]').type(
      users.successfulRegistration.lastName
    );
    cy.get('input[name="email"]').type(users.successfulRegistration.email);
    cy.get('input[name="password"]').type(
      users.successfulRegistration.password
    );
    cy.get('input[name="coPassword"]').type(
      users.successfulRegistration.confirmPassword
    );

    cy.get('button[type="submit"]').click();

    cy.get(".toast-body")
      .should("be.visible")
      .contains("Successfully registered! Please log in!");

    cy.url().should("include", "/auth/login");
  });

  it("Failed registration with password mismatch", () => {
    cy.get('input[name="username"]').type(
      users.successfulRegistration.username
    );
    cy.get('input[name="firstName"]').type(
      users.successfulRegistration.firstName
    );
    cy.get('input[name="lastName"]').type(
      users.successfulRegistration.lastName
    );
    cy.get('input[name="email"]').type(users.successfulRegistration.email);
    cy.get('input[name="password"]').type(
      users.successfulRegistration.password
    );
    cy.get('input[name="coPassword"]').type("differentPassword");

    cy.get('button[type="submit"]').click();

    cy.get('input[name="coPassword"]')
      .parent()
      .find(".invalid-feedback")
      .should("be.visible")
      .and("contain.text", "Passwords don't match.");
  });

  it("Failed registration with invalid email", () => {
    cy.get('input[name="username"]').type(
      users.unsuccessfulRegistration.username
    );
    cy.get('input[name="firstName"]').type(
      users.unsuccessfulRegistration.firstName
    );
    cy.get('input[name="lastName"]').type(
      users.unsuccessfulRegistration.lastName
    );
    cy.get('input[name="email"]').type("invalid-email");
    cy.get('input[name="password"]').type(
      users.unsuccessfulRegistration.password
    );
    cy.get('input[name="coPassword"]').type(
      users.unsuccessfulRegistration.confirmPassword
    );

    cy.get('button[type="submit"]').click();

    cy.get('input[name="email"]')
      .parent()
      .find(".invalid-feedback")
      .should("be.visible")
      .and("contain.text", "Please provide a valid email address.");

    cy.url().should("include", "/auth/register");
  });

  it("Register without entering any data", () => {
    cy.get('button[type="submit"]').click();

    cy.get('input[name="username"]:invalid').should("exist");
    cy.get('input[name="firstName"]:invalid').should("exist");
    cy.get('input[name="lastName"]:invalid').should("exist");
    cy.get('input[name="email"]:invalid').should("exist");
    cy.get('input[name="password"]:invalid').should("exist");
    cy.get('input[name="coPassword"]:invalid').should("exist");
  });
});
