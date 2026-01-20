import React from "react";
import { Container, Card, Table, Row, Col, Badge } from "react-bootstrap";

const CustomerAccountView = () => {
  const accountDetails = {
    customerName: "Demo Customer",
    bank: "Demo Bank",
    accountNo: "ACC10001",
    ifsc: "DEMO0001234",
    contact: "9876543210",
    balance: "₹1500",
    status: "Active",
  };

  const transactionsData = [
    {
      id: "TXN12345",
      date: "25-03-2024 19:20",
      type: "Deposit",
      amount: "₹500",
      balance: "₹1500",
    },
    {
      id: "TXN12346",
      date: "25-03-2024 12:37",
      type: "Withdraw",
      amount: "₹200",
      balance: "₹1300",
    },
    {
      id: "TXN12347",
      date: "24-03-2024 10:10",
      type: "Deposit",
      amount: "₹1000",
      balance: "₹1500",
    },
  ];

  const thStyle = {
    backgroundColor: "#8B0000",
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    borderColor: "#8B0000",
    verticalAlign: "middle",
    fontSize: "0.9rem",
  };

  const tdStyle = {
    textAlign: "center",
    verticalAlign: "middle",
    borderColor: "#D2B48C",
    padding: "10px",
    fontSize: "0.9rem",
  };

  return (
    <Container fluid className="py-5">
      <Card
        className="shadow-lg mx-auto"
        style={{
          maxWidth: "1400px",
          backgroundColor: "#F5F5DC",
          border: "3px solid #8B0000",
          borderRadius: "12px",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* HEADER */}
        <Card.Header
          className="text-center fw-bold fs-3 p-4"
          style={{ backgroundColor: "#8B0000", color: "#fff" }}
        >
          Customer Account Details
        </Card.Header>

        <Card.Body>
          {/* ACCOUNT DETAILS */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <Row className="g-3 text-center">
                <Col md={4}>
                  <strong>Customer Name</strong>
                  <div>{accountDetails.customerName}</div>
                </Col>
                <Col md={4}>
                  <strong>Bank</strong>
                  <div>{accountDetails.bank}</div>
                </Col>
                <Col md={4}>
                  <strong>Account No</strong>
                  <div>{accountDetails.accountNo}</div>
                </Col>

                <Col md={4}>
                  <strong>IFSC Code</strong>
                  <div>{accountDetails.ifsc}</div>
                </Col>
                <Col md={4}>
                  <strong>Contact</strong>
                  <div>{accountDetails.contact}</div>
                </Col>
                <Col md={4}>
                  <strong>Balance</strong>
                  <div className="fw-bold text-success">
                    {accountDetails.balance}
                  </div>
                </Col>

                <Col md={12}>
                  <strong>Status</strong>
                  <div>
                    <Badge
                      bg={
                        accountDetails.status === "Active"
                          ? "success"
                          : "danger"
                      }
                      className="px-3 py-2"
                    >
                      {accountDetails.status}
                    </Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* TRANSACTION HISTORY */}
          <Table responsive hover bordered className="mb-0">
            <thead>
              <tr>
                <th style={thStyle}>Transaction ID</th>
                <th style={thStyle}>Date & Time</th>
                <th style={thStyle}>Transaction Type</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Balance After Txn</th>
              </tr>
            </thead>
            <tbody>
              {transactionsData.map((t, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{t.id}</td>
                  <td style={tdStyle}>{t.date}</td>
                  <td style={tdStyle}>
                    <Badge
                      bg={t.type === "Deposit" ? "success" : "danger"}
                      className="px-3 py-2"
                    >
                      {t.type}
                    </Badge>
                  </td>
                  <td style={tdStyle}>
                    <strong>{t.amount}</strong>
                  </td>
                  <td style={tdStyle}>
                    <strong>{t.balance}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerAccountView;
