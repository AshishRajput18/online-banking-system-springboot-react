import React from "react";
import { Container, Card } from "react-bootstrap";

const About = () => {
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
          About Us
        </Card.Header>
        <Card.Body style={{ fontSize: "16px", lineHeight: "1.6" }}>
          <p>
            Welcome to our Bank Management System. This platform allows you to
            view all customer bank accounts, manage transactions, and generate
            statements. Our goal is to provide a seamless and secure banking
            experience for all customers.
          </p>
          <p>
            This application is built with React and React-Bootstrap to ensure
            a modern and responsive design. It uses intuitive modals, tables,
            and buttons for easy navigation.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default About;
