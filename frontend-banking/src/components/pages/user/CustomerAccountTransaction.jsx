import React, { useEffect, useState } from "react";
import { Container, Card, Table, Spinner, Alert } from "react-bootstrap";

const CustomerAccountTransaction = () => {
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Get account info and token from localStorage
  const accountNumber = localStorage.getItem("accountNumber");
  const token = localStorage.getItem("token");
  const [customerName, setCustomerName] = useState(
    localStorage.getItem("customerName") || "Customer"
  );

  useEffect(() => {
    if (!accountNumber || !token) {
      setError("Please login again to view your transactions.");
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        // 🔑 Using query param as per your working API
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/customer/transactions?accountNumber=${accountNumber}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 401) throw new Error("Session expired. Please login again.");
        if (res.status === 403) throw new Error("Access denied – unauthorized for this account.");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server error: ${res.status} – ${errorText || "Unknown"}`);
        }

        const data = await res.json();
        setTransactionsData(Array.isArray(data) ? data : []);

        // Optionally fetch account info to update customerName dynamically
        const accountRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/customer/account/${accountNumber}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (accountRes.ok) {
          const accountData = await accountRes.json();
          setCustomerName(accountData.customer?.name || customerName);
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load transactions.");
        setTransactionsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountNumber, token]);

  // ─────────── Styles ───────────
  const thStyle = {
    backgroundColor: "#8B0000",
    color: "#fff",
    textAlign: "center",
    fontSize: "0.95rem",
    padding: "12px",
  };

  const tdStyle = {
    textAlign: "center",
    fontSize: "0.9rem",
    verticalAlign: "middle",
    padding: "10px",
  };

  const getRowColor = (type) => {
    switch (type) {
      case "DEPOSIT": return "#e6ffe6";
      case "WITHDRAW": return "#ffe6e6";
      case "TRANSFER": return "#fffbe6";
      default: return "#f8f9fa";
    }
  };

  const formatCurrency = (value) => (value != null ? `₹${Number(value).toFixed(2)}` : "—");

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "—";

  return (
    <Container fluid className="py-5">
      <Card
        className="mx-auto shadow-lg"
        style={{
          maxWidth: "1400px",
          backgroundColor: "#fdfdf5",
          border: "3px solid #8B0000",
          borderRadius: "10px",
        }}
      >
        <Card.Header
          className="text-center fw-bold fs-4 py-4"
          style={{ backgroundColor: "#8B0000", color: "#ffffff" }}
        >
          {customerName}'s Transactions
        </Card.Header>

        <Card.Body className="p-4">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <p className="mt-3 text-muted">Loading your transactions...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">{error}</Alert>
          ) : transactionsData.length === 0 ? (
            <Alert variant="info" className="text-center">No transactions found for this account.</Alert>
          ) : (
            <Table bordered hover responsive className="mb-0">
              <thead>
                <tr>
                  <th style={thStyle}>Txn ID</th>
                  <th style={thStyle}>Bank</th>
                  <th style={thStyle}>Account No</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Balance After</th>
                  <th style={thStyle}>Recipient Bank</th>
                  <th style={thStyle}>Recipient Account</th>
                  <th style={thStyle}>Purpose</th>
                  <th style={thStyle}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {transactionsData.map((t) => (
                  <tr key={t.id} style={{ backgroundColor: getRowColor(t.type) }}>
                    <td style={tdStyle}>{t.transactionId|| "—"}</td>
                    <td style={tdStyle}>{t.bankName || "—"}</td>
                    <td style={tdStyle}>{t.accountNumber || "—"}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontWeight: 600,
                          backgroundColor:
                            t.type === "DEPOSIT" ? "#28a74533" :
                            t.type === "WITHDRAW" ? "#dc354533" :
                            "#ffc10733",
                        }}
                      >
                        {t.type || "—"}
                      </span>
                    </td>
                    <td style={tdStyle}>{formatCurrency(t.amount)}</td>
                    <td style={tdStyle}>{formatCurrency(t.balance)}</td>
                    <td style={tdStyle}>{t.recipientBank || "—"}</td>
                    <td style={tdStyle}>{t.recipientAccount || "—"}</td>
                    <td style={tdStyle}>{t.purpose || "—"}</td>
                    <td style={tdStyle}>{formatDate(t.date)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerAccountTransaction;
