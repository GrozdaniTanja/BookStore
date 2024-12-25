import { Row, Col, Form } from "react-bootstrap";

function Address({ title, handleChangeAddress, address }) {
  return (
    <div id="billing-address">
      <div className="address-section mb-4">
        <h4>{title}</h4>

        <Row className="g-3">
          <Col md="6" sm="12">
            {" "}
            <Form.Group className="mb-3" controlId="street">
              <Form.Label>Street</Form.Label>
              <Form.Control
                onChange={handleChangeAddress}
                value={address.street}
                name="street"
                type="text"
                required
              />
              <Form.Control.Feedback type="invalid">
                Invalid street format.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md="6" sm="12">
            {" "}
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                onChange={handleChangeAddress}
                value={address.city}
                name="city"
                type="text"
                required
              />
              <Form.Control.Feedback type="invalid">
                Invalid city format.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="g-3">
          <Col md="6" sm="12">
            {" "}
            <Form.Group className="mb-3" controlId="suite">
              <Form.Label>Suite</Form.Label>
              <Form.Control
                onChange={handleChangeAddress}
                value={address.suite}
                name="suite"
                type="text"
                required
              />
              <Form.Control.Feedback type="invalid">
                Invalid suite format.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md="6" sm="12">
            {" "}
            <Form.Group className="mb-3" controlId="zipcode">
              <Form.Label>Zip</Form.Label>
              <Form.Control
                onChange={handleChangeAddress}
                value={address.zipcode}
                name="zipcode"
                type="text"
                required
              />
              <Form.Control.Feedback type="invalid">
                Invalid zip code format.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Address;
