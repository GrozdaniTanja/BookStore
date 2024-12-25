import React, { useState, useEffect } from "react";
import Address from "./AddressV2";
import Form from "react-bootstrap/Form";

function CustomerAddressV2({
  placeOrder,
  handleChangeAddress,
  billingAddress,
  deliveryAddress,
  validated,
}) {
  const [localDeliveryAddress, setLocalDeliveryAddress] =
    useState(deliveryAddress);

  useEffect(() => {
    setLocalDeliveryAddress(deliveryAddress);
  }, [deliveryAddress]);

  return (
    <>
      <style>
        {`
          .section-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.25rem;
            margin-bottom: 20px;
          }

          .section-number {
            width: 45px;   /* Adjusted size */
            height: 45px;  /* Adjusted size */
            border-radius: 50%;
            background-color: #343a40;
            color: #fff;
            font-size: 1.5rem; /* Adjusted font size */
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 1;
            text-align: center;
          }

          .address-form {
            max-width: 1000px;
            width: 100%;
            margin: 0 auto;
            background: #f8f9fa;
          }

          .address-form .row {
            margin-bottom: 15px;
          }

          .btn-lg {
            padding: 8px 15px;
          }

          .address-form .row,
          .form-check {
            width: 100%;
            display: block;
          }

          .address-section {
            display: block;
            width: 100%;
            box-sizing: border-box;
          }

          .address-section .row {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }

          .address-section .col-md-6 {
            flex: 1 1 calc(50% - 7.5px);
          }

          .form-check {
            margin-top: 15px;
          }

          @media (max-width: 768px) {
            .address-section .col-md-6 {
              flex: 1 1 100%;
            }
          }
        `}
      </style>

      <div className="section-title mt-5">
        <span className="section-number me-2 d-inline-block text-center">
          2
        </span>
        <h3 className="mb-0">Select Address</h3>
      </div>

      <Form
        onSubmit={(e) => placeOrder(e)}
        className="p-4 address-form shadow-sm rounded bg-light"
        noValidate
        validated={validated}
      >
        <div className="row">
          <div className="col-12">
            <Address
              title="Delivery Address"
              handleChangeAddress={(e) => handleChangeAddress(e, "delivery")}
              address={localDeliveryAddress}
              autoComplete="on"
            />
          </div>

          <div className="col-12">
            <Address
              title="Billing Address"
              handleChangeAddress={(e) => handleChangeAddress(e, "billing")}
              address={billingAddress}
              autoComplete="on"
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-dark btn-lg px-4" type="submit">
            Place Order
          </button>
        </div>
      </Form>
    </>
  );
}

export default CustomerAddressV2;
