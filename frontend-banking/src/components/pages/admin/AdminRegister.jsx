import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://online-banking-system.up.railway.app/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Registration failed");
      }

      setSuccess("Admin registered successfully! Redirecting to login...");
      setEmail("");
      setPassword("");

      // ⏳ Redirect after 2 seconds
      setTimeout(() => {
        navigate("/user/login");
      }, 2000);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          maxWidth: "420px",
          width: "100%",
          backgroundColor: "#F5F5DC",
          border: "3px solid #8B0000",
          borderRadius: "12px",
          fontFamily: "Georgia, serif",
        }}
      >
        <Card.Body className="px-4 py-4">
          {/* HEADER */}
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
            Admin Register
          </h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <Form.Group className="mb-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
                required
              />
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-5">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
                required
              />
            </Form.Group>

            {/* REGISTER BUTTON */}
            <Button
              type="submit"
              className="w-100 fw-bold py-3"
              style={{
                backgroundColor: "#8B0000",
                borderColor: "#8B0000",
                fontSize: "1.05rem",
                borderRadius: "0 0 8px 8px",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminRegister;
