import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!role || !email || !password) {
    setError("Please fill all fields");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, email, password }),
    });

    // Read response safely
    const text = await response.text();

    let data = {};
    if (text) {
      data = JSON.parse(text);
    }

    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials");
    }

    // 🔐 Save token & common info
localStorage.setItem("token", data.token);
localStorage.setItem("role", data.role);
localStorage.setItem("userEmail", data.email);

// ================= ROLE SPECIFIC =================
if (data.role === "CUSTOMER") {
  localStorage.setItem("accountNumber", data.accountNumber);
}

if (data.role === "BANK") {
  localStorage.setItem("bankId", data.bankId);
}



    // 🚦 Redirect
    if (data.role === "ADMIN") {
      navigate("/");
    } else if (data.role === "BANK") {
      navigate("/");
    } else if (data.role === "CUSTOMER") {
      navigate("/");
    } else {
      throw new Error("Invalid role received");
    }

  } catch (err) {
    setError(err.message || "Login failed");
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
            User Login
          </h3>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* ROLE */}
            <Form.Group className="mb-4">
              <Form.Label>User Role</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                size="lg"
                required
              >
                <option value="">Select Role</option>
                <option value="CUSTOMER">Customer</option>
                <option value="BANK">Bank</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>

            {/* EMAIL */}
            <Form.Group className="mb-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
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

            {/* LOGIN BUTTON */}
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
                  <Spinner size="sm" className="me-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserLogin;
