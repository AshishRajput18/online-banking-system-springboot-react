import React, { useEffect, useState } from "react";
import { Container, Card, Table, Spinner, Alert } from "react-bootstrap";

const BankTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const bankId = localStorage.getItem("bankId");

  useEffect(() => {
    if (!token || !bankId) {
      setError("Please login again. Missing authentication data.");
      setLoading(false);
      return;
    }

    // Debug logs – remove in production
    console.log("Fetching transactions for bankId:", bankId);
    console.log("Token (first 20 chars):", token.substring(0, 20) + "...");

    const fetchBankTransactions = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/bank/transactions?bankId=${bankId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);

        if (response.status === 401) {
          throw new Error("Unauthorized – please login again");
        }
        if (response.status === 403) {
          throw new Error("Access denied – insufficient permissions");
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error ${response.status}: ${errorText || "Unknown error"}`);
        }

        const data = await response.json();

        console.log("Received data:", data);
        console.log("Number of transactions:", data?.length ?? 0);

        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(err.message || "Failed to load transactions");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBankTransactions();
  }, [bankId, token]); // dependencies

  // ────────────────────────────────────────────────
  // Styling
  // ────────────────────────────────────────────────

  const headerStyle = {
    backgroundColor: "#8B0000",
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: "0.95rem",
    padding: "12px",
  };

  const cellStyle = {
    textAlign: "center",
    verticalAlign: "middle",
    padding: "10px",
    fontSize: "0.9rem",
  };

  const typeBadgeStyle = (type) => ({
    backgroundColor:
      type === "DEPOSIT" ? "#d4edda" :
      type === "WITHDRAW" ? "#f8d7da" :
      type === "TRANSFER" ? "#fff3cd" : "#e2e3e5",
    color: "#000",
    padding: "6px 12px",
    borderRadius: "16px",
    fontWeight: "600",
    fontSize: "0.85rem",
    display: "inline-block",
    minWidth: "90px",
  });

  const formatCurrency = (value) =>
    value != null ? `₹${Number(value).toFixed(2)}` : "—";

  const formatDate = (isoString) =>
    isoString ? new Date(isoString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) : "—";

  return (
    <Container fluid className="py-4">
      <Card
        className="shadow-lg border-0 mx-auto"
        style={{
          maxWidth: "1450px",
          backgroundColor: "#fdfdf5",
          border: "2px solid #8B0000",
          borderRadius: "10px",
        }}
      >
        <Card.Header
          className="text-center py-4 fw-bold fs-4"
          style={{ backgroundColor: "#8B0000", color: "white" }}
        >
          Bank-Wide Transactions
        </Card.Header>

        <Card.Body className="p-4">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <p className="mt-3 text-muted">Loading transactions...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          ) : (
            <>
              {transactions.length === 0 ? (
                <Alert variant="info" className="text-center">
                  No transactions found for this bank.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table bordered hover className="mb-0">
                    <thead>
                      <tr>
                        <th style={headerStyle}>Txn ID</th>
                        <th style={headerStyle}>Bank</th>
                        <th style={headerStyle}>Customer</th>
                        <th style={headerStyle}>Account No</th>
                        <th style={headerStyle}>Type</th>
                        <th style={headerStyle}>Amount</th>
                        <th style={headerStyle}>Balance After</th>
                        <th style={headerStyle}>Recipient Bank</th>
                        <th style={headerStyle}>Recipient Account</th>
                        <th style={headerStyle}>Purpose</th>
                        <th style={headerStyle}>Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((txn, index) => (
                        <tr key={index}>
                          <td style={cellStyle}>{txn.id || txn.transactionId || "—"}</td>
                          <td style={cellStyle}>{txn.bank || "—"}</td>
                          <td style={cellStyle}>{txn.customerName || "—"}</td>
                          <td style={cellStyle}>{txn.accountNo || "—"}</td>
                          <td style={cellStyle}>
                            <span style={typeBadgeStyle(txn.type)}>{txn.type || "—"}</span>
                          </td>
                          <td style={cellStyle}>{formatCurrency(txn.amount)}</td>
                          <td style={cellStyle}>{formatCurrency(txn.balance)}</td>
                          <td style={cellStyle}>{txn.recipientBank || "—"}</td>
                          <td style={cellStyle}>{txn.recipientAccount || "—"}</td>
                          <td style={cellStyle}>{txn.purpose || "—"}</td>
                          <td style={cellStyle}>{formatDate(txn.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BankTransactions;