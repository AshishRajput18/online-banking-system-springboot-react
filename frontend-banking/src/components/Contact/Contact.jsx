import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

const Contact = () => {
  return (
    <Container fluid className="py-5">
      <Card
        className="shadow-lg mx-auto"
        style={{
          maxWidth: "1000px",
          backgroundColor: "#F5F5DC",
          border: "3px solid #8B0000",
          borderRadius: "12px",
          fontFamily: "Georgia, serif",
        }}
      >
        <Card.Header
          className="text-center fw-bold p-4 fs-3"
          style={{ backgroundColor: "#8B0000", color: "white" }}
        >
          Contact Us
        </Card.Header>
        <Card.Body style={{ fontSize: "16px", lineHeight: "1.6" }}>
          <Row>
            <Col md={6}>
              <p>
                <b>Address:</b> 123 Demo Street, Demo City, India
              </p>
              <p>
                <b>Email:</b> support@demobank.com
              </p>
              <p>
                <b>Phone:</b> +91 9876543210
              </p>
            </Col>
            <Col md={6}>
              <p>
                <b>Customer Support:</b> Available Mon-Fri, 9am to 6pm
              </p>
              <p>
                <b>Feedback:</b> We welcome your feedback to improve our
                services.
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Contact;
