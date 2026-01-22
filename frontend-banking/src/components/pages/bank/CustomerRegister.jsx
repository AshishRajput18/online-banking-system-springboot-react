import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    contact: "",
    age: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((v) => v === "")) {
      setError("Please fill all fields");
      return;
    }

    try {
      setError("");
      setSuccess("");

      // ✅ GET JWT TOKEN (stored after bank manager login)
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized. Please login as Bank Manager.");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/customer/register`,
        {
          ...formData,
          age: Number(formData.age),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Customer Registered Successfully");

      // ✅ Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        gender: "",
        contact: "",
        age: "",
        street: "",
        city: "",
        pincode: "",
      });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Registration failed"
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 py-5"
    >
      <Card
        className="shadow-lg"
        style={{
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "#F5F5DC",
          border: "3px solid #8B0000",
          borderRadius: "12px",
          fontFamily: "Georgia, serif",
        }}
      >
        <Card.Body className="px-4 py-4">
          <h3
            className="fw-bold text-center mb-4 py-3"
            style={{
              backgroundColor: "#8B0000",
              color: "#fff",
              borderRadius: "8px 8px 0 0",
              margin: "-1.5rem -1.5rem 2rem -1.5rem",
              letterSpacing: "1px",
            }}
          >
            Customer Register
          </h3>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-4">
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* ROW 1 */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={formData.name} onChange={handleChange} required />
              </Col>

              <Col md={6}>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Col>
            </Row>

            {/* ROW 2 */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Col>

              <Col md={6}>
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </Form.Select>
              </Col>
            </Row>

            {/* ROW 3 */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Contact No</Form.Label>
                <Form.Control name="contact" value={formData.contact} onChange={handleChange} required />
              </Col>

              <Col md={6}>
                <Form.Label>Age</Form.Label>
                <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} required />
              </Col>
            </Row>

            {/* ROW 4 */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Street</Form.Label>
                <Form.Control as="textarea" rows={2} name="street" value={formData.street} onChange={handleChange} required />
              </Col>

              <Col md={6}>
                <Form.Label>City</Form.Label>
                <Form.Control name="city" value={formData.city} onChange={handleChange} required />
              </Col>
            </Row>

            {/* ROW 5 */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Label>Pincode</Form.Label>
                <Form.Control name="pincode" value={formData.pincode} onChange={handleChange} required />
              </Col>
            </Row>

            <Button
              type="submit"
              className="w-100 fw-bold py-3"
              style={{
                backgroundColor: "#8B0000",
                borderColor: "#8B0000",
              }}
            >
              Register Customer
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerRegister;
