import React, { useState } from "react";
import CartItem from "./CartItem";
import DeleteItemModal from "./DeleteItemModal";

function OrderSummaryV2({
  cartItems,
  totalCartValue,
  changeQuantity,
  deleteCartItem,
}) {
  const [modalShow, setModalShow] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const showDeleteModal = (id) => {
    setModalShow(true);
    setIdToDelete(id);
  };

  const deleteCartItemAndModalClose = () => {
    deleteCartItem(idToDelete);
    setModalShow(false);
  };

  return (
    <>
      <style>
        {`
    .order-summary {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 20px;
      height: 100%;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .section-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #343a40;
      color: #fff;
      font-size: 1.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .order {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background-color: #fff;
      margin-bottom: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .order-total {
      font-size: 1.25rem;
      font-weight: 600;
      border-top: 1px solid #ddd;
      padding-top: 10px;
      margin-top: 10px;
    }

    .order-total h4 {
      margin: 0;
    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }

    .col-md-6 {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 0 20px;
      flex: 1;
    }

    .invalid {
      display: none;
    }

    .invalid.show {
      display: block;
    }
  `}
      </style>
      <br></br>
      <br></br>
      <div className="section-title">
        <span className="section-number">1</span>
        <h3>Order Summary</h3>
      </div>

      <div className="order">
        {cartItems.map((order) => (
          <CartItem
            key={order.name}
            cartItem={order}
            changeQuantity={changeQuantity}
            showDeleteModal={showDeleteModal}
          />
        ))}

        <div className="order-total d-flex justify-content-between">
          <h4>Total:</h4>
          <h4>{totalCartValue} RON</h4>
        </div>
      </div>

      <DeleteItemModal
        deleteCartItemAndModalClose={deleteCartItemAndModalClose}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <div className="invalid bg-danger mt-5 text-center">
        <p className="text-white p-3">
          An error occurred! Please check the addresses you entered.
        </p>
      </div>
    </>
  );
}

export default OrderSummaryV2;
