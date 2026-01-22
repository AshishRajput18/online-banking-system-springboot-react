import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert, Row, Col } from "react-bootstrap";

const AddBank = () => {
  const [formData, setFormData] = useState({
    bankName: "",
    bankCode: "",
    bankManagerId: "", // ✅ Initialize bankManagerId
    website: "",
    bankAddress: "",
    bankEmail: "",
    phoneNumber: "",
    country: "",
    currency: "",
  });

  const [error, setError] = useState("");
  const [managers, setManagers] = useState([]);

  // ✅ Fetch all bank managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/bank-managers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to load managers: ${response.status}`);
        }

        const data = await response.json();
        setManagers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load managers");
      }
    };

    fetchManagers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit bank registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!Object.values(formData).every((val) => val)) {
      setError("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      // Prepare request payload
      const payload = { ...formData }; // Includes bankManagerId now

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/bank/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(`Failed to register bank: ${res.status} ${errMsg}`);
      }

      alert("Bank Registered Successfully");
      setError("");

      // Clear form
      setFormData({
        bankName: "",
        bankCode: "",
        bankManagerId: "",
        website: "",
        bankAddress: "",
        bankEmail: "",
        phoneNumber: "",
        country: "",
        currency: "",
      });
    } catch (err) {
      console.error(err);
      setError("Bank registration failed: " + err.message);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 py-5"
      style={{ fontFamily: "Georgia, serif" }}
    >
      <Card
        className="shadow-lg"
        style={{
          maxWidth: "750px",
          width: "100%",
          backgroundColor: "#F5F5DC",
          border: "3px solid #8B0000",
          borderRadius: "12px",
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
            Add Bank
          </h3>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Bank Name */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Bank Code */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bank Code</Form.Label>
                  <Form.Control
                    name="bankCode"
                    value={formData.bankCode}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Bank Manager Dropdown */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bank Manager</Form.Label>
                  <Form.Select
                    name="bankManagerId"
                    value={formData.bankManagerId}
                    onChange={handleChange}
                    size="lg"
                    required
                  >
                    <option value="">Select Bank Manager</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Website */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Address */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bank Address</Form.Label>
                  <Form.Control
                    name="bankAddress"
                    value={formData.bankAddress}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Email */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bank Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="bankEmail"
                    value={formData.bankEmail}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Phone */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Country */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Currency */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Currency</Form.Label>
                  <Form.Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    size="lg"
                    required
                  >
                    <option value="">Select Currency</option>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button
              type="submit"
              className="w-100 fw-bold py-3 mt-4"
              style={{
                backgroundColor: "#8B0000",
                borderColor: "#8B0000",
                borderRadius: "0 0 8px 8px",
              }}
            >
              Register Bank
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddBank;
