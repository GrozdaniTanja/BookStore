/* global hj */
import React, { useState } from "react";
import EditBookModal from "./EditBookModal";
import DeleteBookModal from "./DeleteBookModal";
import Button from "react-bootstrap/esm/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { LinkContainer } from "react-router-bootstrap";
import { BASE_URL } from "../../Constants";
import { FaCartPlus, FaEye } from "react-icons/fa";

function BookV2({
  id,
  name,
  author,
  category,
  image,
  publishing_house,
  price,
  quantity,
  rating,
  discount,
  date,
  getBooks,
  isAdmin,
  cartItemsNumber,
  setCartItemsNumber,
}) {
  const [editModalShow, setEditModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [show, setShow] = useState(false);

  const deleteBook = () => {
    fetch(`${BASE_URL}/books/${id}`, {
      method: "DELETE",
    }).then((data) => {
      if (data.status === 200) {
        getBooks();
      }
    });
  };

  const handleAddToCart = (id) => {
    hj("event", "add_to_cart_B");
    let cartItems = JSON.parse(localStorage.getItem("items"));
    if (cartItems) {
      let count = 0;
      for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === id) {
          cartItems[i].quantity += 1;
          count += 1;
        }
      }
      if (count < 1) {
        cartItems.push({
          id: id,
          name: `${name}`,
          price: price,
          quantity: 1,
        });
      }
      setCartItemsNumber(cartItemsNumber + 1);
      localStorage.setItem("items", JSON.stringify(cartItems));
    } else {
      const items = [{ id: id, name: `${name}`, price: price, quantity: 1 }];
      localStorage.setItem("items", JSON.stringify(items));
      setCartItemsNumber(cartItemsNumber + 1);
    }
    setShow(true);
  };

  const handleSeeDetails = () => {
    hj("event", "details_viewed_B");
  };

  return (
    <>
      <ToastContainer className="p-3 top-0 end-0">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Body>Book added to cart!</Toast.Body>
        </Toast>
      </ToastContainer>
      <DeleteBookModal
        deleteBook={deleteBook}
        onHide={() => setDeleteModalShow(false)}
        show={deleteModalShow}
      />
      <EditBookModal
        id={id}
        category={category}
        name={name}
        author={author}
        publishing_house={publishing_house}
        price={price}
        discount={discount}
        quantity={quantity}
        date={date}
        rating={rating}
        image={image}
        show={editModalShow}
        getBooks={getBooks}
        onHide={() => setEditModalShow(false)}
      />
      <div
        className="book-card col-lg-3 col-md-4 col-sm-6 col-12 g-5 d-flex flex-column"
        style={{
          opacity: quantity === 0 ? 0.5 : 1,
          backgroundColor: quantity === 0 ? "#f8f9fa" : "white",
        }}
      >
        {isAdmin && (
          <div className="action-buttons d-flex justify-content-end" id={id}>
            <Button
              variant="warning"
              onClick={() => setEditModalShow(true)}
              className="me-2"
              style={{ fontSize: "12px", marginBottom: "5px" }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setDeleteModalShow(true)}
              className="me-2"
              style={{ fontSize: "12px", marginBottom: "5px" }}
            >
              Delete
            </Button>
          </div>
        )}
        <div
          className="book-img d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "#fff",
            width: "100%",
            height: "250px",
            position: "relative",
          }}
        >
          <img
            src={"images/" + image}
            alt="Book cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          />
          {discount > 0 && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                backgroundColor: "#dc3545",
                color: "white",
                padding: "10px 15px",
                borderRadius: "50%",
                fontWeight: "bold",
                fontSize: "16px",
                textAlign: "center",
                width: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              SALE
            </div>
          )}
        </div>

        <div
          className="book-info d-flex flex-column justify-content-between"
          style={{ padding: "0 10px", marginTop: "20px" }}
        >
          <h4 className="book-name" style={{ marginBottom: "-50px" }}>
            {name}
          </h4>
          <p
            className="author"
            style={{
              marginBottom: "-30px",
              fontSize: "14px",
              color: "#6c757d",
            }}
          >
            {author}
          </p>

          {discount > 0 ? (
            <h5 style={{ marginBottom: "5px" }}>
              Price:
              <span className="text-muted ms-2">
                <del>{price} RON</del>
              </span>
              <span className="text-danger ms-2">{price - discount} RON</span>
            </h5>
          ) : (
            <h5 style={{ marginBottom: "10px" }}>
              Price: <span className="text-primary">{price} RON</span>
            </h5>
          )}

          <div
            className="actionButtons d-flex justify-content-between align-items-center"
            style={{ marginTop: "-30px" }}
          >
            <LinkContainer to={"/books/" + name}>
              <span
                style={{
                  color: "#0d6efd",
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={handleSeeDetails}
              >
                <FaEye className="me-2" />
                See details
              </span>
            </LinkContainer>
            <Button
              variant={quantity > 0 ? "success" : "secondary"}
              onClick={() => handleAddToCart(id)}
              disabled={quantity === 0}
              className="d-flex align-items-center mt-2"
              style={{
                padding: "6px 10px",
                fontSize: "14px",
                width: "33%",
                minWidth: "120px",
                display: "block",
                margin: "0 auto",
                textAlign: "center",
                marginTop: "3px",
              }}
              title={quantity === 0 ? "Out of stock" : ""}
            >
              <FaCartPlus className="me-2" />
              {quantity > 0 ? "Add to cart" : "Out of stock"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookV2;
