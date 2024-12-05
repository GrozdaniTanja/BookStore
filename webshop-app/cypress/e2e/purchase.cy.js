describe("Purchase book Tests", () => {
  beforeEach(() => {
    cy.fixture("fixtures.json").then((data) => {
      const successfulOrder = data.successfulOrder;

      cy.window().then((window) => {
        window.localStorage.setItem(
          "items",
          JSON.stringify(successfulOrder.cartItems)
        );
        window.localStorage.setItem("user_id", successfulOrder.user.id);
      });
    });
  });

  it("should display the cart items correctly", () => {
    cy.visit("/cart");

    cy.get(".order").should("have.length.greaterThan", 0);

    cy.get(".order .item-container")
      .first()
      .within(() => {
        cy.get(".item-container-product").should("have.text", "Book 1");
        cy.get(".quantity").should("have.text", "2");
        cy.get(".price").should("have.text", "2 x 10 = 20 RON");
      });
  });

  it("should display the correct total cart value", () => {
    cy.visit("/cart");
    cy.get(".order-total h4").last().should("contain", "35 RON");
  });

  it("should allow increasing and decreasing the quantity of items", () => {
    cy.visit("/cart");

    // increase the quantity of the book 1
    cy.get(".order .item-container")
      .first()
      .within(() => {
        cy.get(".quantity-btn.plus-btn").click();
      });

    cy.get(".order .item-container")
      .first()
      .within(() => {
        cy.get(".quantity").should("have.text", "3"); // verify that its 3
      });

    cy.get(".order-total h4").last().should("contain", "45 RON"); // (10 * 3) + (15 * 1) = 45 RON

    // decrease e the quantity of the book 2
    cy.get(".order .item-container")
      .first()
      .within(() => {
        cy.get(".quantity-btn.minus-btn").click();
      });

    cy.get(".order .item-container")
      .first()
      .within(() => {
        cy.get(".quantity").should("have.text", "2"); // verify that its 2
      });

    cy.get(".order-total h4").last().should("contain", "35 RON"); // (10 * 2) + (15 * 1) = 35
  });

  it("should allow deleting an item from the cart", () => {
    cy.visit("/cart");

    cy.get(".order .item-container")
      .eq(1)
      .within(() => {
        cy.get(".delete-item").click();
      });

    cy.get(".order .item-container").should("have.length", 2);

    cy.get(".order .item-container")
      .eq(0)
      .within(() => {
        cy.get(".item-container-product").should("have.text", "Book 1");
      });
  });

  it("should allow the user to place an order if logged in", () => {
    cy.visit("/cart");

    cy.get('input[name="street"]').eq(0).type("123 Delivery St");
    cy.get('input[name="suite"]').eq(0).type("Apt 5C");
    cy.get('input[name="city"]').eq(0).type("New York");
    cy.get('input[name="zipcode"]').eq(0).type("10002");

    cy.get('input[name="street"]').eq(1).type("123 Billing St");
    cy.get('input[name="suite"]').eq(1).type("Apt 6D");
    cy.get('input[name="city"]').eq(1).type("New York");
    cy.get('input[name="zipcode"]').eq(1).type("10003");

    cy.get("form").submit();

    cy.get(".toast-body").should("contain", "Your ordered!");

    cy.get(".order").should("not.exist");
  });

  it("should show an error if there are validation issues with the order form", () => {
    cy.visit("/cart");

    cy.get("form").submit();

    cy.get(".toast-body").should(
      "contain",
      "Please fill in all required fields correctly."
    );
  });
});
