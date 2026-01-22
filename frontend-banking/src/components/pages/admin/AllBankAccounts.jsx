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
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

const AllBankAccounts = () => {
  const navigate = useNavigate();
  const pdfRef = useRef(null);

  const [accountsData, setAccountsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const mapped = data.map((a) => ({
        accountId: a.id,
        customer: a.customer?.name || "—",
        bank: a.bank?.bankName || "—",
        bankCode: a.bank?.bankCode || a.bank?.code || "—",
        bankEmail: a.bank?.email || a.bank?.bankEmail || "—",
        website: a.bank?.website || a.bank?.url || "—",
        accountNo: a.accountNumber || "—",
        ifsc: a.ifscCode || "—",
        type: a.accountType || "—",
        status: a.status === "ACTIVE" ? "Open" : "Closed",
        contact: a.customer?.contact || "—",
        balance: a.balance || 0,
        name: a.customer?.name || "—",

        // ─── Added missing fields for modal + PDF ───────────────────────
        email: a.customer?.email || "—",
        gender: a.customer?.gender || "—",
      }));

      setAccountsData(mapped);
    } catch (err) {
      console.error("Failed to load accounts:", err);
    }
  };

  const handleViewDetail = async (account) => {
    setLoading(true);
    setSelectedAccount(account);
    setTransactions([]);
    setShowModal(true);
    setStartDate("");
    setEndDate("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customer/transactions?accountNumber=${account.accountNo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        console.warn(`Transactions fetch failed: ${res.status}`);
        throw new Error(`HTTP ${res.status}`);
      }

      const txnData = await res.json();
      setTransactions(Array.isArray(txnData) ? txnData : []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
    setTransactions([]);
  };

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

  const filteredTransactions = useMemo(() => {
    if (!startDate && !endDate) return transactions;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    return transactions.filter((tx) => {
      const dateField = tx.date || tx.time || tx.createdAt || tx.transactionDate;
      if (!dateField) return false;

      const txDate = new Date(dateField);
      if (isNaN(txDate.getTime())) return false;

      if (start && txDate < start) return false;
      if (end && txDate > end) return false;
      return true;
    });
  }, [transactions, startDate, endDate]);

  const handleDownload = () => {
    if (!selectedAccount || !pdfRef.current) return;

    setTimeout(() => {
      html2pdf()
        .set({
          margin: [12, 14, 12, 14],
          filename: `Bank_Statement_${selectedAccount.accountNo || "unknown"}.pdf`,
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
            All Bank Accounts
          </Card.Header>

          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead style={{ backgroundColor: "rgba(139,0,0,0.1)" }}>
                <tr>
                  <th>Customer Name</th>
                  <th>Bank Name</th>
                  <th>Account No</th>
                  <th>IFSC Code</th>
                  <th>Account Type</th>
                  <th>Detail</th>
                  <th>Status</th>
                  <th>Statement</th>
                </tr>
              </thead>
              <tbody>
                {accountsData.map((acc) => (
                  <tr key={acc.accountNo}>
                    <td>{acc.customer}</td>
                    <td>{acc.bank}</td>
                    <td>{acc.accountNo}</td>
                    <td>{acc.ifsc}</td>
                    <td>{acc.type}</td>
                    <td>
                      <Button
                        size="sm"
                        style={{ backgroundColor: "#8B0000", border: "none" }}
                        disabled={acc.status === "Closed"}
                        onClick={() => handleViewDetail(acc)}
                      >
                        View
                      </Button>
                    </td>
                    <td>
                      <Badge bg={acc.status === "Open" ? "success" : "secondary"}>
                        {acc.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        style={{ backgroundColor: "#8B0000", border: "none" }}
                        disabled={acc.status === "Closed"}
                        onClick={() =>
                          navigate(`/admin/bank/account/statement/${acc.accountNo}`)
                        }
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* ─── Modal ─────────────────────────────────────────────────────────────── */}
      {showModal && selectedAccount && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          <div className="d-flex justify-content-center">
            <Card
              style={{
                width: "940px",
                maxWidth: "95%",
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
                  Customer Bank Account Detail – {selectedAccount.accountNo}
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
                      onClick={handleDownload}
                      variant="outline-danger"
                      style={{ borderColor: "#8B0000", color: "#8B0000" }}
                    >
                      Download Statement
                    </Button>
                  </Col>
                </Row>

                <Row className="g-4 mb-5">
                  <Col md={6}>
                    <Form.Label className="fw-bold">Bank Name</Form.Label>
                    <Form.Control readOnly value={selectedAccount.bank} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Account No</Form.Label>
                    <Form.Control readOnly value={selectedAccount.accountNo} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">IFSC Code</Form.Label>
                    <Form.Control readOnly value={selectedAccount.ifsc} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Customer Name</Form.Label>
                    <Form.Control readOnly value={selectedAccount.name} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Email</Form.Label>
                    <Form.Control readOnly value={selectedAccount.email} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Contact No</Form.Label>
                    <Form.Control readOnly value={selectedAccount.contact} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Gender</Form.Label>
                    <Form.Control readOnly value={selectedAccount.gender} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Balance</Form.Label>
                    <Form.Control
                      readOnly
                      value={`₹${Number(selectedAccount.balance).toFixed(2)}`}
                      className="fw-bold text-success"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Status</Form.Label>
                    <Badge
                      bg={selectedAccount.status === "Open" ? "success" : "secondary"}
                      className="fs-6"
                    >
                      {selectedAccount.status}
                    </Badge>
                  </Col>
                </Row>

                <h5 className="fw-bold mb-3">
                  Transactions {filteredTransactions.length > 0 && `(${filteredTransactions.length} shown)`}
                </h5>

                {loading ? (
                  <div className="text-center py-5"><Spinner animation="border" /></div>
                ) : transactions.length === 0 ? (
                  <p className="text-center text-muted py-4">No transactions available</p>
                ) : filteredTransactions.length === 0 && (startDate || endDate) ? (
                  <p className="text-center text-warning py-4">
                    No transactions in selected date range
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
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id || tx.transactionId || Math.random()}>
                          <td>{tx.transactionId || "—"}</td>
                          <td>{tx.type || "—"}</td>
                          <td>₹{Number(tx.amount || 0).toFixed(2)}</td>
                          <td>{tx.recipientAccount || tx.toAccount || "—"}</td>
                          <td>{tx.purpose || tx.description || tx.narration || "—"}</td>
                          <td>{formatDate(tx.date || tx.time || tx.createdAt || tx.transactionDate)}</td>
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

      {/* ─── Hidden PDF Content ─────────────────────────────────────────────── */}
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
                  Account & Bank Details
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
                          {tx.recipientAccount || tx.toAccount || "—"}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px 6px",
                            wordBreak: "break-word",
                          }}
                        >
                          {tx.purpose || tx.description || tx.narration || "—"}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px 6px",
                            textAlign: "center",
                          }}
                        >
                          {formatDate(tx.date || tx.time || tx.createdAt || tx.transactionDate)}
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

export default AllBankAccounts;