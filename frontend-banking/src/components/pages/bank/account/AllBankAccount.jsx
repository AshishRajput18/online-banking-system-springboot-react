import React, { useState, useEffect, useRef } from "react";
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
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

const AllBankAccount = () => {
  const navigate = useNavigate();
  const pdfRef = useRef(null);

  const [accountsData, setAccountsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [showLockModal, setShowLockModal] = useState(false);
  const [accountToLock, setAccountToLock] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = localStorage.getItem("token");

  // ────────────────────────────────────────────────
  // FETCH ALL ACCOUNTS
  // ────────────────────────────────────────────────
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/accounts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch accounts");
        const data = await res.json();
        setAccountsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAccounts();
  }, [token]);

  // ────────────────────────────────────────────────
  // VIEW DETAIL + FETCH TRANSACTIONS
  // ────────────────────────────────────────────────
  const handleViewDetail = async (acc) => {
    setSelectedAccount(acc);
    setTransactions([]);
    setShowModal(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customer/transactions?accountNumber=${acc.accountNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const txnData = await res.json();
        setTransactions(txnData || []);
      }
    } catch (err) {
      console.warn("Could not load transactions", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
    setTransactions([]);
    setStartDate("");
    setEndDate("");
  };

  // ────────────────────────────────────────────────
  // LOCK / UNLOCK
  // ────────────────────────────────────────────────
  const handleLockClick = (acc) => {
    setAccountToLock(acc);
    setShowLockModal(true);
  };

  const handleConfirmLock = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/lock/${accountToLock.accountNumber}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Lock failed");

      setAccountsData((prev) =>
        prev.map((a) =>
          a.accountNumber === accountToLock.accountNumber
            ? { ...a, status: "INACTIVE" }
            : a
        )
      );
    } catch (err) {
      alert("Failed to lock account");
    }

    setShowLockModal(false);
    setAccountToLock(null);
  };

  const handleUnlockAccount = async (acc) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/unlock/${acc.accountNumber}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Unlock failed");

      setAccountsData((prev) =>
        prev.map((a) =>
          a.accountNumber === acc.accountNumber ? { ...a, status: "ACTIVE" } : a
        )
      );
    } catch (err) {
      alert("Failed to unlock account");
    }
  };

  // ────────────────────────────────────────────────
  // PDF DOWNLOAD with improved design
  // ────────────────────────────────────────────────
  const handleDownload = () => {
    if (!selectedAccount || !pdfRef.current) return;

    setTimeout(() => {
      html2pdf()
        .set({
          margin: [12, 14, 12, 14],
          filename: `Bank_Statement_${selectedAccount.accountNumber || "unknown"}.pdf`,
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

  // Filter transactions for display & PDF
  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && txDate < start) return false;
    if (end && txDate > end) return false;
    return true;
  });

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
                    <th>Customer</th>
                    <th>Bank</th>
                    <th>Account No</th>
                    <th>IFSC</th>
                    <th>Type</th>
                    <th>Detail</th>
                    <th>Status</th>
                    <th>Statement</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {accountsData.map((acc) => (
                    <tr key={acc.id || acc.accountNumber}>
                      <td>{acc.customer?.name || "—"}</td>
                      <td>{acc.bank?.bankName || "—"}</td>
                      <td>{acc.accountNumber}</td>
                      <td>{acc.ifscCode || "—"}</td>
                      <td>{acc.accountType || "—"}</td>

                      <td>
                        <Button
                          size="sm"
                          disabled={acc.status === "INACTIVE"}
                          onClick={() => handleViewDetail(acc)}
                          style={{
                            backgroundColor: "#8B0000",
                            borderColor: "#8B0000",
                          }}
                        >
                          View Detail
                        </Button>
                      </td>

                      <td>
                        <Badge
                          bg={acc.status === "ACTIVE" ? "success" : "secondary"}
                        >
                          {acc.status}
                        </Badge>
                      </td>

                      <td>
                        <Button
                          size="sm"
                          disabled={acc.status === "INACTIVE"}
                          onClick={() =>
                            navigate(
                              `/admin/bank/account/statement/${acc.accountNumber}`
                            )
                          }
                          style={{
                            backgroundColor: "#8B0000",
                            borderColor: "#8B0000",
                          }}
                        >
                          View
                        </Button>
                      </td>

                      <td>
                        {acc.status === "ACTIVE" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleLockClick(acc)}
                          >
                            Lock
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleUnlockAccount(acc)}
                          >
                            Unlock
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* ──────────────────────────────── DETAIL MODAL ──────────────────────────────── */}
      {showModal && selectedAccount && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-center align-items-start py-5">
            <Card
              style={{
                width: "900px",
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
                    borderRadius: "8px 8px 0 0",
                    margin: "-1.5rem -1.5rem 2rem -1.5rem",
                  }}
                >
                  Customer Bank Account Detail
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
                    <Form.Control readOnly value={selectedAccount.bank?.bankName || "—"} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Account No</Form.Label>
                    <Form.Control readOnly value={selectedAccount.accountNumber} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">IFSC Code</Form.Label>
                    <Form.Control readOnly value={selectedAccount.ifscCode || "—"} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Customer Name</Form.Label>
                    <Form.Control readOnly value={selectedAccount.customer?.name || "—"} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Contact No</Form.Label>
                    <Form.Control readOnly value={selectedAccount.customer?.contact || "—"} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Balance</Form.Label>
                    <Form.Control
                      readOnly
                      value={`₹${Number(selectedAccount.balance || 0).toFixed(2)}`}
                      className="fw-bold text-success"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Status</Form.Label>
                    <div>
                      <Badge
                        bg={selectedAccount.status === "ACTIVE" ? "success" : "secondary"}
                        className="fs-6"
                      >
                        {selectedAccount.status || "UNKNOWN"}
                      </Badge>
                    </div>
                  </Col>
                </Row>

                <h5 className="fw-bold mb-3">Recent Transactions</h5>

                {filteredTransactions.length > 0 ? (
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
                        <tr key={tx.id}>
                          <td>{tx.transactionId}</td>
                          <td>{tx.type}</td>
                          <td>₹{Number(tx.amount || 0).toFixed(2)}</td>
                          <td>{tx.recipientAccount || "—"}</td>
                          <td>{tx.purpose || tx.narration || "—"}</td>
                          <td>
                            {tx.date ? new Date(tx.date).toLocaleString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-center text-muted py-4">
                    No transactions found in selected period.
                  </p>
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

      {/* Lock / Unlock Confirmation Modal */}
      <Modal show={showLockModal} onHide={() => setShowLockModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {accountToLock?.status === "ACTIVE" ? "Lock Account" : "Unlock Account"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {accountToLock?.status === "ACTIVE"
            ? `Are you sure you want to lock account `
            : `Are you sure you want to unlock account `}
          <b>{accountToLock?.accountNumber}</b>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLockModal(false)}>
            Cancel
          </Button>
          <Button
            variant={accountToLock?.status === "ACTIVE" ? "danger" : "success"}
            onClick={
              accountToLock?.status === "ACTIVE"
                ? handleConfirmLock
                : () => handleUnlockAccount(accountToLock)
            }
          >
            {accountToLock?.status === "ACTIVE" ? "Lock" : "Unlock"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ──────────────────────────────── HIDDEN PDF CONTENT ──────────────────────────────── */}
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
              <b>Customer:</b> {selectedAccount.customer?.name || "—"}       
              <b>Account No:</b> {selectedAccount.accountNumber}       
              <b>IFSC:</b> {selectedAccount.ifscCode || "—"}
            </p>

            {/* Two columns – Bank & Account */}
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
                  Bank Details
                </h4>
                <p style={{ margin: "6px 0" }}>
                  <b>Bank Name:</b> {selectedAccount.bank?.bankName || "—"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>Bank Code:</b> {selectedAccount.bank?.bankCode || "—"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>Email:</b> {selectedAccount.bank?.bankEmail || "—"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>Website:</b> {selectedAccount.bank?.website || "—"}
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
                  <b>Account No:</b> {selectedAccount.accountNumber}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>IFSC Code:</b> {selectedAccount.ifscCode || "—"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <b>Mobile:</b> {selectedAccount.customer?.contact || "—"}
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
                    <th style={{ border: "1px solid #444", padding: "8px 6px", width: "20%" }}>
                      Recipient
                    </th>
                    <th style={{ border: "1px solid #444", padding: "8px 6px", width: "24%" }}>
                      Narration
                    </th>
                    <th style={{ border: "1px solid #444", padding: "8px 6px", width: "20%" }}>
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px 6px",
                            textAlign: "center",
                            wordBreak: "break-all",
                          }}
                        >
                          {tx.transactionId}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px 6px",
                            textAlign: "center",
                          }}
                        >
                          {tx.type}
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
                          {tx.purpose || tx.narration || "—"}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px 6px",
                            textAlign: "center",
                          }}
                        >
                          {tx.date ? new Date(tx.date).toLocaleString() : "—"}
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
              System generated statement – {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AllBankAccount;