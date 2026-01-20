import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import html2pdf from "html2pdf.js";

const AccountDetail = () => {
  const pdfRef = useRef();
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;
  const token = localStorage.getItem("token");

  const [accountInfo, setAccountInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ACCOUNT ================= */
  const fetchAccount = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/bank/account/detail?email=${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Account not found");
      const data = await res.json();
      setAccountInfo(data);
      fetchTransactions();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /* ================= FETCH TRANSACTIONS ================= */
  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/bank/account/transactions?email=${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setTransactions(data);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DEPOSIT ================= */
  const handleDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) {
      alert("Enter valid deposit amount");
      return;
    }

    await fetch("http://localhost:8080/api/bank/account/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        amount: depositAmount,
      }),
    });

    setDepositAmount("");
    fetchAccount();
  };

  /* ================= WITHDRAW ================= */
  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert("Enter valid withdraw amount");
      return;
    }

    await fetch("http://localhost:8080/api/bank/account/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        amount: withdrawAmount,
      }),
    });

    setWithdrawAmount("");
    fetchAccount();
  };

  useEffect(() => {
    if (!email) {
      navigate("/bank/customers");
      return;
    }
    fetchAccount();
  }, []);

  /* ================= PDF ================= */
  const downloadPDF = () => {
    setTimeout(() => {
      html2pdf()
        .set({
          margin: [12, 14, 12, 14],
          filename: `Bank_Statement_${accountInfo.accountNo}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(pdfRef.current)
        .save();
    }, 150);
  };

  // ─── Safe date formatter ───────────────────────────────────────────────
  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ================= STYLES (UNCHANGED) ================= */
  const cardStyle = {
    backgroundColor: "#F5F5DC",
    border: "3px solid #8B0000",
    borderRadius: "12px",
    fontFamily: "Georgia, serif",
  };

  const headerBarStyle = {
    backgroundColor: "#8B0000",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.6rem",
    padding: "16px",
  };

  const thStyle = {
    backgroundColor: "#8B0000",
    color: "#fff",
    textAlign: "center",
  };

  const tdStyle = {
    textAlign: "center",
    padding: "8px",
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container fluid className="py-5">
      <Row className="g-4">
        {/* ================= LEFT ================= */}
        <Col lg={8}>
          <Card className="shadow-lg" style={cardStyle}>
            <Card.Header style={headerBarStyle}>
              Customer Bank Account Detail
            </Card.Header>

            <Card.Body>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}><b>Bank:</b> {accountInfo.bankName}</Col>
                    <Col md={6}><b>Account No:</b> {accountInfo.accountNo}</Col>
                    <Col md={6}><b>IFSC:</b> {accountInfo.ifsc}</Col>
                    <Col md={6}><b>Customer:</b> {accountInfo.customerName}</Col>
                    <Col md={6}><b>Contact:</b> {accountInfo.contact}</Col>
                    <Col md={6}><b>Created:</b> {accountInfo.createdOn}</Col>
                    <Col md={6}><b>Balance:</b> ₹{accountInfo.balance}</Col>
                    <Col md={6}>
                      <b>Status:</b>{" "}
                      <Badge bg="success">{accountInfo.status}</Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Button
                variant="outline-secondary"
                className="mb-3"
                onClick={downloadPDF}
              >
                Download PDF
              </Button>

              <Table bordered hover>
                <thead>
                  <tr>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{t.date}</td>
                      <td style={tdStyle}>
                        <Badge bg={t.type === "DEPOSIT" ? "success" : "danger"}>
                          {t.type}
                        </Badge>
                      </td>
                      <td style={tdStyle}>₹{t.amount}</td>
                      <td style={tdStyle}>₹{t.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* ================= RIGHT ================= */}
        <Col lg={4}>
          {/* DEPOSIT */}
          <Card className="shadow-lg mb-4" style={cardStyle}>
            <Card.Header style={headerBarStyle}>Bank Deposit</Card.Header>
            <Card.Body>
              <Form.Control value={accountInfo.bankName} disabled className="mb-2"/>
              <Form.Control value={accountInfo.accountNo} disabled className="mb-2"/>
              <Form.Control
                type="number"
                placeholder="Amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="mb-3"
              />
              <Button className="w-100" onClick={handleDeposit}>
                Deposit
              </Button>
            </Card.Body>
          </Card>

          {/* WITHDRAW */}
          <Card className="shadow-lg" style={cardStyle}>
            <Card.Header style={{ ...headerBarStyle, background: "#A52A2A" }}>
              Bank Withdraw
            </Card.Header>
            <Card.Body>
              <Form.Control value={accountInfo.customerName} disabled className="mb-2"/>
              <Form.Control value={accountInfo.accountNo} disabled className="mb-2"/>
              <Form.Control
                type="number"
                placeholder="Amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="mb-2"
              />
              <div className="text-center fw-bold mb-2">
                ₹{accountInfo.balance} Available
              </div>
              <Button
                className="w-100"
                style={{ backgroundColor: "#DC143C" }}
                onClick={handleWithdraw}
              >
                Withdraw
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* PDF CONTENT ── updated to match AllBankAccount style */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          ref={pdfRef}
          style={{
            fontFamily: "Georgia, serif",
            padding: "28px 32px",
            border: "3px solid #8B0000",
            backgroundColor: "#ffffff",
            width: "190mm",
            boxSizing: "border-box",
            fontSize: "13.5px",
            lineHeight: "1.5",
          }}
        >
          {/* Header with logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "32px",
              paddingBottom: "16px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <img
              src="/assets/bank-logo.png"
              alt="Bank Logo"
              style={{ height: "55px", marginRight: "20px" }}
            />
            <h2
              style={{
                flex: 1,
                textAlign: "center",
                margin: 0,
                fontSize: "21px",
                color: "#5a0000",
              }}
            >
              Customer Bank Statement
            </h2>
          </div>

          {/* Summary line */}
          <p
            style={{
              textAlign: "center",
              marginBottom: "36px",
              fontSize: "14px",
              color: "#333",
            }}
          >
            <b>Customer:</b> {accountInfo.customerName || "—"}{"       "}
            <b>Account No:</b> {accountInfo.accountNo}{"       "}
            <b>IFSC:</b> {accountInfo.ifsc || "—"}
          </p>

          {/* Two columns – Customer & Account */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "40px",
              gap: "24px",
            }}
          >
            <div style={{ width: "48%" }}>
              <h4
                style={{
                  borderBottom: "2px solid #8B0000",
                  paddingBottom: "8px",
                  marginBottom: "14px",
                  fontSize: "15.5px",
                }}
              >
                Customer Details
              </h4>
              <p style={{ margin: "6px 0" }}>
                <b>Name:</b> {accountInfo.customerName || "—"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <b>Contact:</b> {accountInfo.contact || "—"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <b>Created On:</b> {formatDate(accountInfo.createdOn) || "—"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <b>Status:</b> {accountInfo.status || "—"}
              </p>
            </div>

            <div style={{ width: "48%" }}>
              <h4
                style={{
                  borderBottom: "2px solid #8B0000",
                  paddingBottom: "8px",
                  marginBottom: "14px",
                  fontSize: "15.5px",
                }}
              >
                Account Details
              </h4>
              <p style={{ margin: "6px 0" }}>
                <b>Bank:</b> {accountInfo.bankName || "—"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <b>Account No:</b> {accountInfo.accountNo}
              </p>
              <p style={{ margin: "6px 0" }}>
                <b>IFSC:</b> {accountInfo.ifsc || "—"}
              </p>
              <p style={{ margin: "6px 0" }}>
                <b>Balance:</b> ₹{Number(accountInfo.balance || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Transactions Title */}
          <h4
            style={{
              margin: "0 0 14px 0",
              fontSize: "16px",
              color: "#5a0000",
            }}
          >
            Bank Transactions
          </h4>

          {/* Transaction Table */}
          <div style={{ overflowX: "hidden", marginBottom: "28px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
                fontSize: "12.8px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#8B0000", color: "#fff" }}>
                  <th style={{ border: "1px solid #444", padding: "8px 6px", width: "22%" }}>
                    Date & Time
                  </th>
                  <th style={{ border: "1px solid #444", padding: "8px 6px", width: "14%" }}>
                    Type
                  </th>
                  <th
                    style={{
                      border: "1px solid #444",
                      padding: "8px 6px",
                      width: "18%",
                      textAlign: "right",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      border: "1px solid #444",
                      padding: "8px 6px",
                      width: "18%",
                      textAlign: "right",
                    }}
                  >
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 6px",
                          textAlign: "left",
                        }}
                      >
                        {formatDate(tx.date || tx.time || tx.createdAt || tx.transactionDate)}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 6px",
                          textAlign: "center",
                        }}
                      >
                        {tx.type || "—"}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 6px",
                          textAlign: "right",
                        }}
                      >
                        ₹{Number(tx.amount || 0).toFixed(2)}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 6px",
                          textAlign: "right",
                        }}
                      >
                        ₹{Number(tx.balance || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: "16px", color: "#555" }}
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <p
            style={{
              marginTop: "36px",
              fontSize: "11px",
              textAlign: "center",
              color: "#555",
              borderTop: "1px solid #ddd",
              paddingTop: "14px",
            }}
          >
            System generated statement – {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>
    </Container>
  );
};

export default AccountDetail;