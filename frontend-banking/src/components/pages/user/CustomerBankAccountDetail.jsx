import React, { useRef, useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Form, Badge, Spinner } from "react-bootstrap";
import html2pdf from "html2pdf.js";
import axios from "axios";

const CustomerBankAccountDetail = () => {
  const pdfRef = useRef(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [accountData, setAccountData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const accountNumber = localStorage.getItem("accountNumber");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!accountNumber || !token) {
        setError("Please login again. Missing account or token.");
        setLoading(false);
        return;
      }

      try {
        const accountResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/customer/account/${accountNumber}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAccountData(accountResponse.data);

        const txnResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/customer/transactions?accountNumber=${accountNumber}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(txnResponse.data || []);
      } catch (err) {
        console.error("API error:", err);
        const status = err.response?.status;
        if (status === 403) setError("Access denied (403) – check your role or token permissions.");
        else if (status === 401) setError("Unauthorized (401) – please login again.");
        else setError(err.message || "Failed to load account details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountNumber, token]);

  const handleDownload = () => {
    if (!accountData || !pdfRef.current) return;

    setTimeout(() => {
      html2pdf()
        .set({
          margin: [12, 14, 12, 14],           // increased right margin
          filename: `Bank_Statement_${accountData.accountNumber || "unknown"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff"
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(pdfRef.current)
        .save();
    }, 150);
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /> Loading...</div>;
  if (error) return <div className="text-center text-danger py-5">{error}</div>;
  if (!accountData) return <div className="text-center py-5">No account data available.</div>;

  const { bank, customer } = accountData;

  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && txDate < start) return false;
    if (end && txDate > end) return false;
    return true;
  });

  return (
    <>
      <Container fluid className="py-5">
        <Card className="shadow-lg mx-auto" style={{ maxWidth: "900px", backgroundColor: "#F5F5DC", border: "3px solid #8B0000", borderRadius: "12px" }}>
          <Card.Body>
            <h3 className="fw-bold text-center mb-4 py-3" style={{ backgroundColor: "#8B0000", color: "#fff", borderRadius: "8px" }}>
              Customer Bank Account Detail
            </h3>

            <Row className="g-3 mb-4 align-items-end">
              <Col md={4}>
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </Col>
              <Col md={4}>
                <Form.Label>End Date</Form.Label>
                <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </Col>
              <Col md={4} className="text-end">
                <Button onClick={handleDownload} variant="outline-danger" style={{ borderColor: "#8B0000", color: "#8B0000" }}>
                  Download Statement
                </Button>
              </Col>
            </Row>

            <Row className="g-4">
              <Col md={6}><Form.Label className="fw-bold">Bank Name</Form.Label><Form.Control readOnly value={bank?.bankName || "—"} /></Col>
              <Col md={6}><Form.Label className="fw-bold">Account No</Form.Label><Form.Control readOnly value={accountData.accountNumber || "—"} /></Col>
              <Col md={6}><Form.Label className="fw-bold">IFSC Code</Form.Label><Form.Control readOnly value={accountData.ifscCode || "—"} /></Col>
              <Col md={6}><Form.Label className="fw-bold">Customer Name</Form.Label><Form.Control readOnly value={customer?.name || "—"} /></Col>
              <Col md={6}><Form.Label className="fw-bold">Contact No</Form.Label><Form.Control readOnly value={customer?.contact || "—"} /></Col>
              <Col md={6}><Form.Label className="fw-bold">Account Creation Date</Form.Label>
                <Form.Control readOnly value={accountData.createdOn ? new Date(accountData.createdOn).toLocaleDateString() : "—"} />
              </Col>
              <Col md={6}><Form.Label className="fw-bold">Available Balance</Form.Label>
                <Form.Control readOnly value={`₹${Number(accountData.balance || 0).toFixed(2)}`} className="fw-bold text-success" />
              </Col>
              <Col md={6}><Form.Label className="fw-bold">Status</Form.Label>
                <Badge bg={accountData.status === "ACTIVE" ? "success" : "secondary"} className="fs-6">
                  {accountData.status || "UNKNOWN"}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      {/* Hidden PDF content – red border on all sides, better spacing */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div 
          ref={pdfRef} 
          style={{ 
            fontFamily: "Georgia, serif",
            padding: "28px 32px",               // more padding → right side border visible
            border: "3px solid #8B0000",        // red border on ALL sides
            backgroundColor: "#ffffff",
            width: "190mm",                     // narrower → prevents right cutoff
            boxSizing: "border-box",
            fontSize: "13.5px",
            lineHeight: "1.5"
          }}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            marginBottom: "32px",
            paddingBottom: "16px",
            borderBottom: "1px solid #ddd"
          }}>
            <img 
              src="/assets/bank-logo.png" 
              alt="Bank Logo" 
              style={{ height: "55px", marginRight: "20px" }} 
            />
            <h2 style={{ 
              flex: 1, 
              textAlign: "center", 
              margin: 0,
              fontSize: "21px",
              color: "#5a0000"
            }}>
              Customer Bank Statement
            </h2>
          </div>

          <p style={{ 
            textAlign: "center", 
            marginBottom: "36px", 
            fontSize: "14px",
            color: "#333"
          }}>
            <b>Customer:</b> {customer?.name || "—"}       
            <b>Account No:</b> {accountData.accountNumber}       
            <b>IFSC:</b> {accountData.ifscCode}
          </p>

          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginBottom: "40px",
            gap: "24px"
          }}>
            <div style={{ width: "48%" }}>
              <h4 style={{ 
                borderBottom: "2px solid #8B0000", 
                paddingBottom: "8px", 
                marginBottom: "14px",
                fontSize: "15.5px"
              }}>
                Bank Details
              </h4>
              <p style={{ margin: "6px 0" }}><b>Bank Name:</b> {bank?.bankName || "—"}</p>
              <p style={{ margin: "6px 0" }}><b>Bank Code:</b> {bank?.bankCode || "—"}</p>
              <p style={{ margin: "6px 0" }}><b>Email:</b> {bank?.bankEmail || "—"}</p>
              <p style={{ margin: "6px 0" }}><b>Website:</b> {bank?.website || "—"}</p>
            </div>

            <div style={{ width: "48%" }}>
              <h4 style={{ 
                borderBottom: "2px solid #8B0000", 
                paddingBottom: "8px", 
                marginBottom: "14px",
                fontSize: "15.5px"
              }}>
                Account Details
              </h4>
              <p style={{ margin: "6px 0" }}><b>Account No:</b> {accountData.accountNumber}</p>
              <p style={{ margin: "6px 0" }}><b>IFSC Code:</b> {accountData.ifscCode}</p>
              <p style={{ margin: "6px 0" }}><b>Mobile:</b> {customer?.contact || "—"}</p>
              <p style={{ margin: "6px 0" }}><b>Balance:</b> ₹{Number(accountData.balance || 0).toFixed(2)}</p>
            </div>
          </div>

          <h4 style={{ 
            margin: "0 0 14px 0", 
            fontSize: "16px",
            color: "#5a0000"
          }}>
            Bank Transactions
            {(startDate || endDate) && (
              <small style={{ color: "#555", marginLeft: "16px", fontSize: "12.5px" }}>
                ({startDate || "—"} to {endDate || "—"})
              </small>
            )}
          </h4>

          <div style={{ overflowX: "hidden", marginBottom: "28px" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontSize: "12.8px"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#8B0000", color: "#fff" }}>
                  <th style={{ border: "1px solid #444", padding: "8px 6px", width: "10%" }}>Txn ID</th>
                  <th style={{ border: "1px solid #444", padding: "8px 6px", width: "12%" }}>Type</th>
                  <th style={{ border: "1px solid #444", padding: "8px 6px", width: "14%", textAlign: "right" }}>Amount</th>
                  <th style={{ border: "1px solid #444", padding: "8px 6px", width: "20%" }}>Recipient</th>
                  <th style={{ border: "1px solid #444", padding: "8px 6px", width: "24%" }}>Narration</th>
                  <th style={{ border: "1px solid #444", padding: "8px 6px", width: "20%" }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ border: "1px solid #ccc", padding: "8px 6px", textAlign: "center", wordBreak: "break-all" }}>
                        {tx.transactionId}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px 6px", textAlign: "center" }}>
                        {tx.type}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px 6px", textAlign: "right" }}>
                        ₹{Number(tx.amount || 0).toFixed(2)}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px 6px", wordBreak: "break-word" }}>
                        {tx.recipientAccount || "—"}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px 6px", wordBreak: "break-word" }}>
                        {tx.purpose || "—"}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px 6px", textAlign: "center" }}>
                        {tx.date ? new Date(tx.date).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "16px", color: "#555" }}>
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p style={{ 
            marginTop: "36px", 
            fontSize: "11px", 
            textAlign: "center",
            color: "#555",
            borderTop: "1px solid #ddd",
            paddingTop: "14px"
          }}>
            System generated statement – {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
};

export default CustomerBankAccountDetail;