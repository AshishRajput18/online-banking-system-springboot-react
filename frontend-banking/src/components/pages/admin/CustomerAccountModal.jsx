import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import html2pdf from "html2pdf.js";

// Sample transactions data
const transactionsData = [
  { txId: "TX123456", sourceBank: "India Bank", customer: "Rahul", accountNo: "15478912", type: "Deposit", amount: "499", recipientBank: "—", recipientAccount: "—", purpose: "—", datetime: "06-23-2025 07:53" },
  { txId: "TX987654", sourceBank: "Demo Bank", customer: "DemoC1", accountNo: "98765423", type: "Transfer", amount: "501", recipientBank: "India Bank", recipientAccount: "ACC004", purpose: "Gift for family", datetime: "06-23-2025 10:15 AM" },
  { txId: "TX112233", sourceBank: "Demo Bank", customer: "DemoC1", accountNo: "98765423", type: "Deposit", amount: "3000", recipientBank: "—", recipientAccount: "—", purpose: "Demo Bank", datetime: "06-23-2025 12:19 PM" },
  { txId: "TX445566", sourceBank: "Demo Bank", customer: "Labeb", accountNo: "98765430", type: "Deposit", amount: "1000", recipientBank: "—", recipientAccount: "—", purpose: "—", datetime: "08-23-2025 11:31 AM" },
  { txId: "TX778899", sourceBank: "Demo Bank", customer: "Sechin", accountNo: "98765431", type: "Deposit", amount: "1000", recipientBank: "—", recipientAccount: "—", purpose: "—", datetime: "08-23-2025 12:17 PM" },
  { txId: "TX001122", sourceBank: "Demo Bank", customer: "DemoC1", accountNo: "98765423", type: "Withdraw", amount: "500", recipientBank: "—", recipientAccount: "—", purpose: "—", datetime: "06-23-2025 02:45" },
];

const CustomerAccountModal = ({ show, onHide, accountData }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerTransactions, setCustomerTransactions] = useState([]);

  const pdfRef = useRef(null);

  useEffect(() => {
    if (accountData) {
      const filteredTx = transactionsData.filter(
        (tx) => tx.accountNo === accountData.accountNo
      );
      setCustomerTransactions(filteredTx);
    }
  }, [accountData]);

  if (!accountData) return null;

  const handleDownload = () => {
    html2pdf()
      .set({
        margin: 8,
        filename: `Bank_Statement_${accountData.accountNo}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: "#ffffff", useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(pdfRef.current)
      .save();
  };

  return (
    <>
      {/* ================= MODAL UI ================= */}
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Body className="p-0">
          <Container
            fluid
            className="d-flex justify-content-center align-items-center py-4"
            style={{ backgroundColor: "#F5F5DC" }}
          >
            <Card
              className="shadow-lg"
              style={{
                maxWidth: "800px",
                width: "100%",
                backgroundColor: "#F5F5DC",
                border: "3px solid #8B0000",
                borderRadius: "12px",
              }}
            >
              <Card.Body className="px-4 py-4">
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

                {/* Date filters and PDF button */}
                <Row className="align-items-end g-3 mb-4">
                  <Col md={3}>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Col>
                  <Col md={6} className="text-end">
                    <Button
                      onClick={handleDownload}
                      variant="outline-danger"
                      className="px-4"
                      style={{ borderColor: "#8B0000", color: "#8B0000" }}
                    >
                      Download Statement
                    </Button>
                  </Col>
                </Row>

                {/* Account Details */}
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Label className="fw-bold">Bank Name</Form.Label>
                    <Form.Control readOnly value={accountData.bank} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Account No</Form.Label>
                    <Form.Control readOnly value={accountData.accountNo} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">IFSC Code</Form.Label>
                    <Form.Control readOnly value={accountData.ifsc} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Customer Name</Form.Label>
                    <Form.Control readOnly value={accountData.name} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Contact No</Form.Label>
                    <Form.Control readOnly value={accountData.contact} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Balance</Form.Label>
                    <Form.Control
                      readOnly
                      value={`₹${accountData.balance}`}
                      className="fw-bold text-success"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Status</Form.Label>
                    <div>
                      <Badge bg="success" className="fs-6">
                        {accountData.status}
                      </Badge>
                    </div>
                  </Col>
                </Row>

                <div className="text-end mt-4">
                  <Button variant="secondary" onClick={onHide}>
                    Close
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Container>
        </Modal.Body>
      </Modal>

      {/* ================= PDF CONTENT ================= */}
      {/* ================= HIDDEN PDF CONTENT ================= */}
<div style={{ position: "absolute", left: "-9999px", top: 0 }}>
  <div
    ref={pdfRef}
    style={{
      fontFamily: "Georgia, serif",
      border: "3px solid #8B0000",
      padding: "20px",
      backgroundColor: "#fff",
    }}
  >
    {/* ===== HEADER ===== */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      {/* Bank Logo */}
      <img
        src="/assets/bank-logo.png"
        alt="Bank Logo"
        style={{ height: "60px", marginRight: "15px" }}
      />

      {/* Title */}
      <h2 style={{ flex: 1, textAlign: "center", margin: 0 }}>
        Customer Bank Statement
      </h2>
    </div>

    {/* ===== CUSTOMER SUMMARY ===== */}
    <p
      style={{
        textAlign: "center",
        fontSize: "14px",
        marginBottom: "25px",
      }}
    >
      <b>Customer:</b> {accountData.name} &nbsp; | &nbsp;
      <b>Account No:</b> {accountData.accountNo} &nbsp; | &nbsp;
      <b>IFSC:</b> {accountData.ifsc}
    </p>

    {/* ===== BANK & ACCOUNT DETAILS ===== */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "25px",
      }}
    >
      {/* Left: Bank Details */}
      <div style={{ width: "48%" }}>
        <h4 style={{ borderBottom: "2px solid #8B0000" }}>
          Bank Details
        </h4>
        <p><b>Bank Name:</b> {accountData.bank}</p>
        <p><b>Bank Code:</b> {accountData.bankCode || "BANK001"}</p>
        <p><b>Email:</b> {accountData.bankEmail || "info@bank.com"}</p>
      </div>

      {/* Right: Account Details */}
      <div style={{ width: "48%" }}>
        <h4 style={{ borderBottom: "2px solid #8B0000" }}>
          Account Details
        </h4>
        <p><b>Account No:</b> {accountData.accountNo}</p>
        <p><b>IFSC Code:</b> {accountData.ifsc}</p>
        <p><b>Mobile:</b> {accountData.contact}</p>
        <p><b>Balance:</b> ₹{accountData.balance}</p>
      </div>
    </div>

    {/* ===== TRANSACTIONS ===== */}
    <h4 style={{ marginBottom: "10px" }}>Bank Transactions</h4>

    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#8B0000", color: "#fff" }}>
          <th style={th}>Txn ID</th>
          <th style={th}>Type</th>
          <th style={th}>Amount</th>
          <th style={th}>Recipient</th>
          <th style={th}>Narration</th>
          <th style={th}>Time</th>
        </tr>
      </thead>

      <tbody>
        {customerTransactions.length > 0 ? (
          customerTransactions.map((tx, i) => (
            <tr key={i}>
              <td style={td}>{tx.txId}</td>
              <td style={td}>{tx.type}</td>
              <td style={td}>₹{tx.amount}</td>
              <td style={td}>{tx.recipientAccount || "—"}</td>
              <td style={td}>{tx.purpose}</td>
              <td style={td}>{tx.datetime}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
              No transactions found
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {/* ===== FOOTER ===== */}
    <p style={{ marginTop: "20px", fontSize: "11px" }}>
      This is a system generated bank statement.
    </p>
  </div>
</div>

    </>
  );
};

const th = {
  border: "1px solid #000",
  padding: "6px",
};

const td = {
  border: "1px solid #000",
  padding: "6px",
  textAlign: "center",
};

export default CustomerAccountModal;
