import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Row,
  Col,
  Form,
  Spinner,
} from "react-bootstrap";
import html2pdf from "html2pdf.js";

const AllBankCustomers = () => {
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const pdfRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Failed to fetch customers (${res.status})`);
        const data = await res.json();
        setCustomersData(data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [token]);

  const handleViewAccount = async (customer) => {
    setSelectedAccount(customer);
    setTransactions([]);
    setShowModal(true);
    setStartDate("");
    setEndDate("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customer/transactions?accountNumber=${customer.accountNo}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error(`Transactions fetch failed (${res.status})`);
      const txnData = await res.json();
      setTransactions(Array.isArray(txnData) ? txnData : []);
    } catch (err) {
      console.error("Transaction fetch error:", err);
      setTransactions([]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
    setTransactions([]);
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

  // ─── Filtered transactions (used in modal + PDF) ───────────────────────
  const filteredTransactions = useMemo(() => {
    if (!startDate && !endDate) return transactions;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    return transactions.filter((tx) => {
      const dateVal = tx.date || tx.time || tx.createdAt || tx.transactionDate;
      if (!dateVal) return false;

      const txDate = new Date(dateVal);
      if (isNaN(txDate.getTime())) return false;

      if (start && txDate < start) return false;
      if (end && txDate > end) return false;
      return true;
    });
  }, [transactions, startDate, endDate]);

  const handleDownloadPDF = () => {
    if (!selectedAccount || !pdfRef.current) return;

    setTimeout(() => {
      html2pdf()
        .set({
          margin: [12, 14, 12, 14],
          filename: `Statement_${selectedAccount.accountNo || "unknown"}.pdf`,
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

  return (
    <>
      <Container className="py-5" fluid>
        <Card className="shadow-lg mx-auto" style={{ maxWidth: "1600px" }}>
          <Card.Header
            className="text-center fw-bold p-4 fs-3"
            style={{ backgroundColor: "#8B0000", color: "white" }}
          >
            All Bank Customers
          </Card.Header>

          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="danger" />
              </div>
            ) : error ? (
              <div className="p-4">
                <div className="alert alert-danger">{error}</div>
              </div>
            ) : (
              <Table responsive hover className="mb-0">
                <thead style={{ backgroundColor: "rgba(139,0,0,0.1)" }}>
                  <tr>
                    <th>Name</th>
                    <th>Bank</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Contact</th>
                    <th>Street</th>
                    <th>City</th>
                    <th>Pincode</th>
                    <th>Account</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customersData.map((c, i) => (
                    <tr key={i}>
                      <td>{c.name || "—"}</td>
                      <td>{c.bank || "—"}</td>
                      <td>{c.email || "—"}</td>
                      <td>{c.gender || "—"}</td>
                      <td>{c.contact || "—"}</td>
                      <td>{c.street || "—"}</td>
                      <td>{c.city || "—"}</td>
                      <td>{c.pincode || "—"}</td>
                      <td>
                        <Button
                          size="sm"
                          style={{ backgroundColor: "#8B0000", borderColor: "#8B0000" }}
                          onClick={() => handleViewAccount(c)}
                        >
                          View Account
                        </Button>
                      </td>
                      <td>
                        <Badge bg={c.status === "ACTIVE" ? "success" : "secondary"}>
                          {c.status || "UNKNOWN"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal */}
      {showModal && selectedAccount && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            zIndex: 9999,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          <div className="d-flex justify-content-center align-items-start">
            <Card
              style={{
                width: "920px",
                maxWidth: "96%",
                backgroundColor: "#F5F5DC",
                border: "3px solid #8B0000",
                borderRadius: "12px",
              }}
            >
              <Card.Body>
                <h3
                  className="fw-bold text-center mb-4 py-3"
                  style={{
                    backgroundColor: "#8B0000",
                    color: "#fff",
                    margin: "-1.5rem -1.5rem 2rem -1.5rem",
                    borderRadius: "8px 8px 0 0",
                  }}
                >
                  Customer Account Detail
                </h3>

                <Row className="g-3 mb-4 align-items-end">
                  <Col md={4}>
                    <Form.Label className="fw-bold">Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="fw-bold">End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Col>
                  <Col md={4} className="text-end">
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline-danger"
                      style={{ borderColor: "#8B0000", color: "#8B0000" }}
                    >
                      Download Statement
                    </Button>
                  </Col>
                </Row>

                <Row className="g-4 mb-5">
                  <Col md={6}><Form.Label fw-bold>Customer Name</Form.Label><Form.Control readOnly value={selectedAccount.name || "—"} /></Col>
                  <Col md={6}><Form.Label fw-bold>Account No</Form.Label><Form.Control readOnly value={selectedAccount.accountNo || "—"} /></Col>
                  <Col md={6}><Form.Label fw-bold>IFSC Code</Form.Label><Form.Control readOnly value={selectedAccount.ifsc || "—"} /></Col>
                  <Col md={6}><Form.Label fw-bold>Bank Name</Form.Label><Form.Control readOnly value={selectedAccount.bank || "—"} /></Col>
                  <Col md={6}><Form.Label fw-bold>Email</Form.Label><Form.Control readOnly value={selectedAccount.email || "—"} /></Col>
                  <Col md={6}><Form.Label fw-bold>Contact No</Form.Label><Form.Control readOnly value={selectedAccount.contact || "—"} /></Col>
                  <Col md={6}>
                    <Form.Label fw-bold>Balance</Form.Label>
                    <Form.Control
                      readOnly
                      value={`₹${Number(selectedAccount.balance || 0).toFixed(2)}`}
                      className="fw-bold text-success"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label fw-bold>Status</Form.Label>
                    <Badge
                      bg={selectedAccount.status === "ACTIVE" ? "success" : "secondary"}
                      className="fs-6"
                    >
                      {selectedAccount.status || "UNKNOWN"}
                    </Badge>
                  </Col>
                </Row>

                <h5 className="fw-bold mb-3">
                  Transactions {filteredTransactions.length > 0 && `(${filteredTransactions.length})`}
                </h5>

                {filteredTransactions.length === 0 ? (
                  <p className="text-center text-muted py-4">
                    {startDate || endDate
                      ? "No transactions in selected date range"
                      : "No transactions found"}
                  </p>
                ) : (
                  <Table striped bordered hover responsive size="sm">
                    <thead style={{ backgroundColor: "#8B0000", color: "white" }}>
                      <tr>
                        <th>Txn ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Recipient</th>
                        <th>Narration</th>
                        <th>Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx, i) => (
                        <tr key={i}>
                          <td>{tx.transactionId || "—"}</td>
                          <td>{tx.type || "—"}</td>
                          <td>₹{Number(tx.amount || 0).toFixed(2)}</td>
                          <td>{tx.recipientAccount || "—"}</td>
                          <td>{tx.purpose || tx.description || "—"}</td>
                          <td>{formatDate(tx.date || tx.time || tx.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

                <div className="text-end mt-4">
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      {/* Hidden PDF content ── matched with AccountDetail style */}
      {selectedAccount && (
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
              <b>Customer:</b> {selectedAccount.name || "—"}{"       "}
              <b>Account No:</b> {selectedAccount.accountNo || "—"}{"       "}
              <b>IFSC:</b> {selectedAccount.ifsc || "—"}
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
                  <b>Name:</b> {selectedAccount.name || "—"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>Email:</b> {selectedAccount.email || "—"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>Contact:</b> {selectedAccount.contact || "—"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>Gender:</b> {selectedAccount.gender || "—"}
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
                  <b>Bank:</b> {selectedAccount.bank || "—"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>Account No:</b> {selectedAccount.accountNo || "—"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>IFSC:</b> {selectedAccount.ifsc || "—"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>Balance:</b> ₹{Number(selectedAccount.balance || 0).toFixed(2)}
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
              {(startDate || endDate) && (
                <small style={{ color: "#555", marginLeft: "16px", fontSize: "12.5px" }}>
                  ({startDate || "—"} to {endDate || "—"})
                </small>
              )}
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
                    <th style={{ border: "1px solid #444", padding: "8px 6px", width: "10%" }}>
                      Txn ID
                    </th>
                    <th style={{ border: "1px solid #444", padding: "8px 6px", width: "12%" }}>
                      Type
                    </th>
                    <th
                      style={{
                        border: "1px solid #444",
                        padding: "8px 6px",
                        width: "14%",
                        textAlign: "right",
                      }}
                    >
                      Amount
                    </th>
                    <th style={{ border: "1px solid #444", padding: "8px 6px", width: "18%" }}>
                      Recipient
                    </th>
                    <th style={{ border: "1px solid #444", padding: "8px 6px", width: "24%" }}>
                      Narration
                    </th>
                    <th style={{ border: "1px solid #444", padding: "8px 6px", width: "22%" }}>
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx, i) => (
                      <tr key={i}>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px 6px",
                            textAlign: "center",
                            wordBreak: "break-all",
                          }}
                        >
                          {tx.transactionId || "—"}
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
                            wordBreak: "break-word",
                          }}
                        >
                          {tx.recipientAccount || "—"}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px 6px",
                            wordBreak: "break-word",
                          }}
                        >
                          {tx.purpose || tx.description || "—"}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px 6px",
                            textAlign: "center",
                          }}
                        >
                          {formatDate(tx.date || tx.time || tx.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "16px", color: "#555" }}
                      >
                        No transactions found
                        {startDate || endDate ? " in selected period" : ""}
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
      )}
    </>
  );
};

export default AllBankCustomers;