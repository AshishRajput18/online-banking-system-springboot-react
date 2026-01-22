import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Table, Badge, Spinner, Alert, Form, Button } from "react-bootstrap";

const AllTransactions = () => {
  const { accountNo } = useParams(); // get accountNo from URL
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchAccount, setSearchAccount] = useState(""); // input field for search

  const token = localStorage.getItem("token");

  // ================= FETCH TRANSACTIONS =================
  const fetchTransactions = async (acctNo = "") => {
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const isSpecificAccount = acctNo.trim() !== "";
     const url = accountNo
  ? `${import.meta.env.VITE_API_URL}/api/customer/transactions?accountNumber=${accountNo}`
  : `${import.meta.env.VITE_API_URL}/api/customer/transactions`;
       // all user transactions

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Server error ${res.status}: ${errText || res.statusText}`);
      }

      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions on mount or if URL param changes
  useEffect(() => {
    if (accountNo) {
      fetchTransactions(accountNo); // fetch transactions for URL accountNo
    } else {
      fetchTransactions(); // fetch all user transactions
    }
  }, [accountNo]);

  // ================= SEARCH & RESET =================
  const handleSearch = (e) => {
    e.preventDefault();
    fetchTransactions(searchAccount);
  };

  const handleReset = () => {
    setSearchAccount("");
    fetchTransactions();
  };

  // ================= BADGE COLORS =================
  const getTypeBadge = (type = "") => {
    const t = type.toUpperCase();
    if (t.includes("DEPOSIT")) return "success";
    if (t.includes("WITHDRAW")) return "warning";
    if (t.includes("TRANSFER")) return "info";
    return "secondary";
  };

  return (
    <Container className="py-5" fluid>
      <Card className="shadow-lg mx-auto" style={{ maxWidth: "1600px" }}>
        <Card.Header
          className="text-center fw-bold p-4 fs-3"
          style={{ backgroundColor: "#8B0000", color: "white" }}
        >
         All Transactions
        </Card.Header>

        <Card.Body>
          {/* SEARCH FORM */}
          <Form className="mb-4 d-flex gap-2" onSubmit={handleSearch}>
            <Form.Control
              type="text"
              placeholder="Enter Account Number"
              value={searchAccount}
              onChange={(e) => setSearchAccount(e.target.value)}
            />
            <Button type="submit" variant="dark">Search</Button>
            <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
          </Form>

          {/* LOADING / ERROR / NO DATA */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <p className="mt-3 text-muted">Loading transactions...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : transactions.length === 0 ? (
            <div className="text-center py-5 text-muted">No transactions found.</div>
          ) : (
            <Table responsive hover>
              <thead style={{ backgroundColor: "rgba(139,0,0,0.1)" }}>
                <tr>
                  <th>ID</th>
                  <th>Bank</th>
                  <th>Customer</th>
                  <th>Account No</th>
                  <th>Type</th>
                  <th>Amount (₹)</th>
                  <th>Balance After</th>
                  <th>Recipient Bank</th>
                  <th>Recipient Account</th>
                  <th>Purpose</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="fw-bold text-primary">{tx.id}</td>
                    <td>{tx.bankName || "—"}</td>
                    <td>{tx.customerName || "—"}</td>
                    <td className="fw-bold">{tx.accountNumber || "—"}</td>
                    <td><Badge bg={getTypeBadge(tx.type)}>{tx.type || "—"}</Badge></td>
                    <td className="text-end">{tx.amount}</td>
                    <td className="text-end">{tx.balance}</td>
                    <td>{tx.recipientBank || "—"}</td>
                    <td>{tx.recipientAccount || "—"}</td>
                    <td>{tx.purpose || "—"}</td>
                    <td>{tx.date ? new Date(tx.date).toLocaleString() : "—"}</td>
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

export default AllTransactions;
