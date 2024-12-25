/* global hj */
import Address from "./Address";
import Form from "react-bootstrap/Form";

function CustomerAddress({
  placeOrder,
  handleChangeAddress,
  billingAddress,
  deliveryAddress,
  validated,
}) {
  const placeOrderA = (e) => {
    e.preventDefault();
    placeOrder(e);

    if (typeof hj === "function") {
      const eventName = "order_submitted_A";
      hj("event", eventName);
      console.log(`Hotjar event '${eventName}' triggered!`);
    } else {
      console.error("Hotjar is not loaded.");
    }
  };
  return (
    <>
      {" "}
      <div className="section-title mt-5">
        <span className="section-number">2</span>
        <h3>Select Address</h3>
      </div>
      <Form
        onSubmit={(e) => placeOrderA(e)}
        className="p-2 address-form"
        noValidate
        validated={validated}
      >
        <Address
          title="Delivery Address"
          handleChangeAddress={(e) => handleChangeAddress(e, "delivery")}
          address={deliveryAddress}
        />
        <Address
          title="Billing Address"
          handleChangeAddress={(e) => handleChangeAddress(e, "billing")}
          address={billingAddress}
        />
        <div className="d-flex justify-content-end mt-3">
          <button className="order-btn btn btn-outline-dark" type="submit">
            Place Order
          </button>
        </div>
      </Form>{" "}
    </>
  );
}

export default CustomerAddress;
