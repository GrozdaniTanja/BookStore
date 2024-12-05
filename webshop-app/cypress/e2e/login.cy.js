describe("Login Tests", () => {
  let users;

  beforeEach(() => {
    cy.fixture("fixtures").then((data) => {
      users = data;
    });

    cy.visit("auth/login");
  });

  it("Successful login", () => {
    cy.get('input[name="email"]').type(users.successfulLogin.email);
    cy.get('input[name="password"]').type(users.successfulLogin.password);
    cy.get('button[type="submit"]').click();

    cy.get(".toast-body")
      .should("be.visible")
      .contains("Successfully logged in!");
  });

  it("Failed login with incorrect credentials", () => {
    cy.get('input[name="email"]').type(users.unsuccessfulLogin.email);
    cy.get('input[name="password"]').type(users.unsuccessfulLogin.password);
    cy.get('button[type="submit"]').click();

    cy.get(".toast-body")
      .should("be.visible")
      .contains("The email or the password are incorrect! Please try again.");
    cy.url().should("include", "/login");
  });

  it("Login without entering any data", () => {
    cy.get('button[type="submit"]').click();

    cy.get('input[name="email"]:invalid').should("exist");
    cy.get('input[name="password"]:invalid').should("exist");
  });
});
