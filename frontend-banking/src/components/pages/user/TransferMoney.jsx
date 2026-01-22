import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

const TransferMoney = () => {
  const senderAccountNumber = localStorage.getItem("accountNumber");

  const [formData, setFormData] = useState({
    receiverAccountNumber: "",
    ifscCode: "",
    amount: "",
    purpose: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { receiverAccountNumber, ifscCode, amount, purpose } = formData;

    // Basic validation
    if (!receiverAccountNumber || !ifscCode || !amount || !purpose) {
      setError("Please fill all fields");
      return;
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount greater than zero");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add token if your backend requires authentication for transfer
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          senderAccountNumber,
          receiverAccountNumber,
          ifscCode,
          amount: amountNum,           // send as number → backend converts to BigDecimal
          purpose,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Improve error messages for user
        if (errorText.includes("inactive")) {
          throw new Error("Cannot transfer to this account - it is inactive.");
        }
        if (errorText.includes("Insufficient")) {
          throw new Error("Insufficient balance in your account.");
        }
        throw new Error(errorText || "Transfer failed. Please try again.");
      }

      const result = await response.text();
      setSuccess(result || "Money transferred successfully!");
      
      // Reset form
      setFormData({
        receiverAccountNumber: "",
        ifscCode: "",
        amount: "",
        purpose: "",
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: "600px", border: "3px solid #8B0000" }}>
        <Card.Header
          className="text-center text-white fw-bold"
          style={{ backgroundColor: "#8B0000" }}
        >
          Transfer Money
        </Card.Header>

        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Sender Account</Form.Label>
              <Form.Control value={senderAccountNumber || "Not logged in"} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Receiver Account Number</Form.Label>
              <Form.Control
                name="receiverAccountNumber"
                value={formData.receiverAccountNumber}
                onChange={handleChange}
                placeholder="Enter receiver account number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>IFSC Code</Form.Label>
              <Form.Control
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="Enter IFSC code"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="1"
                placeholder="Enter amount"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Purpose</Form.Label>
              <Form.Control
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Purpose of transfer (e.g., Salary, Rent, Gift)"
                required
              />
            </Form.Group>

            <Button
              type="submit"
              disabled={loading || !senderAccountNumber}
              className="w-100"
              style={{ backgroundColor: "#8B0000", border: "none" }}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Processing...
                </>
              ) : (
                "Transfer Money"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TransferMoney;