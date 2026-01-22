import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";

const AddBankAccount = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const customerEmail = state?.email;

  const [loading, setLoading] = useState(true);
  const [accountExists, setAccountExists] = useState(false);
  const [status, setStatus] = useState("INACTIVE");
  const [error, setError] = useState("");

  const [info, setInfo] = useState({
    bankName: "",
    bankCode: "",
    customerName: "",
    customerEmail: "",
    customerContact: "",
  });

  const [form, setForm] = useState({
    accountNumber: "",
    ifscCode: "",
    accountType: "",
  });

  // 🔹 FETCH CUSTOMER + ACCOUNT STATUS
  useEffect(() => {
    if (!customerEmail) {
      setError("Customer email not found");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1️⃣ CHECK ACCOUNT EXISTS
        const existsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bank/account/exists?email=${customerEmail}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const exists = await existsRes.json();
        setAccountExists(exists);

        // 2️⃣ GET ACCOUNT STATUS
        if (exists) {
          const statusRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/bank/account/status?email=${customerEmail}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const statusText = await statusRes.text();
          setStatus(statusText);
        } else {
          setStatus("INACTIVE");
        }

        // 3️⃣ FETCH CUSTOMER INFO
        const infoRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bank/account/customer-info?email=${customerEmail}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!infoRes.ok) throw new Error();

        const data = await infoRes.json();
        setInfo(data);
      } catch {
        setError("Failed to load account data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerEmail]);

  // 🔹 ADD ACCOUNT
  const handleSubmit = async () => {
    if (!form.accountNumber || !form.ifscCode || !form.accountType) {
      alert("All account fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bank/account/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerEmail,
            ...form,
          }),
        }
      );

      if (!res.ok) throw new Error();

      alert("Account created successfully");
      setAccountExists(true);
      setStatus("ACTIVE");
    } catch {
      alert("Account creation failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <Container fluid className="py-5">
      <Card
        className="shadow-lg mx-auto"
        style={{
          maxWidth: "900px",
          backgroundColor: "#F5F5DC",
          border: "3px solid #8B0000",
          borderRadius: "12px",
          fontFamily: "Georgia, serif",
        }}
      >
        <Card.Header
          className="text-center fw-bold fs-3 p-4"
          style={{ backgroundColor: "#8B0000", color: "#fff" }}
        >
          Add Bank Account
        </Card.Header>

        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="g-3">
            <Col md={6}>
              <Form.Label className="fw-bold">Bank Name</Form.Label>
              <Form.Control value={info.bankName} disabled />
            </Col>

            <Col md={6}>
              <Form.Label className="fw-bold">Bank Code</Form.Label>
              <Form.Control value={info.bankCode} disabled />
            </Col>

            <Col md={6}>
              <Form.Label className="fw-bold">Customer Name</Form.Label>
              <Form.Control value={info.customerName} disabled />
            </Col>

            <Col md={6}>
              <Form.Label className="fw-bold">Customer Email</Form.Label>
              <Form.Control value={info.customerEmail} disabled />
            </Col>

            <Col md={6}>
              <Form.Label className="fw-bold">Customer Contact</Form.Label>
              <Form.Control value={info.customerContact} disabled />
            </Col>

            <Col md={6}>
              <Form.Label className="fw-bold">Account Status</Form.Label>
              <Form.Control
                value={status}
                disabled
                style={{
                  fontWeight: "bold",
                  color: status === "ACTIVE" ? "green" : "red",
                }}
              />
            </Col>

            {!accountExists && (
              <>
                <Col md={6}>
                  <Form.Label className="fw-bold">Account Number</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setForm({ ...form, accountNumber: e.target.value })
                    }
                  />
                </Col>

                <Col md={6}>
                  <Form.Label className="fw-bold">IFSC Code</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setForm({ ...form, ifscCode: e.target.value })
                    }
                  />
                </Col>

                <Col md={6}>
                  <Form.Label className="fw-bold">Account Type</Form.Label>
                  <Form.Select
                    onChange={(e) =>
                      setForm({ ...form, accountType: e.target.value })
                    }
                  >
                    <option value="">Select Type</option>
                    <option>Savings</option>
                    <option>Current</option>
                  </Form.Select>
                </Col>
              </>
            )}
          </Row>

          {!accountExists ? (
            <Button
              className="w-100 mt-4 fw-bold"
              style={{ backgroundColor: "#8B0000", border: "none" }}
              onClick={handleSubmit}
            >
              Add Account
            </Button>
          ) : (
            <Button
              className="w-100 mt-4 fw-bold"
              style={{ backgroundColor: "#006400", border: "none" }}
              onClick={() =>
                navigate("/bank/account/customer/detail", {
                  state: { email: customerEmail },
                })
              }
            >
              View Account Details
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddBankAccount;
