import React, { useEffect, useState } from "react";
import { Container, Card, Table, Alert } from "react-bootstrap";

const AllBanks = () => {
  const [banksData, setBanksData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token missing");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/banks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load banks");
        }

        const data = await response.json();
        setBanksData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load banks");
      }
    };

    fetchBanks();
  }, []);

  return (
    <Container className="py-5" fluid>
      <Card
        className="shadow-lg mx-auto"
        style={{
          maxWidth: "1500px",
          backgroundColor: "#F5F5DC",
          border: "3px solid #8B0000",
          borderRadius: "12px",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* HEADER */}
        <Card.Header
          className="text-center fw-bold p-4 fs-3"
          style={{
            backgroundColor: "#8B0000",
            color: "white",
            borderRadius: "8px 8px 0 0",
          }}
        >
          All Banks
        </Card.Header>

        {error && <Alert variant="danger" className="m-3">{error}</Alert>}

        <Card.Body className="p-0">
          <Table
            responsive
            hover
            className="mb-0"
            style={{ backgroundColor: "#F5F5DC" }}
          >
            <thead>
              <tr
                className="border-0"
                style={{ backgroundColor: "rgba(139,0,0,0.1)" }}
              >
                <th className="fw-bold text-dark">Bank Name</th>
                <th className="fw-bold text-dark">Bank Code</th>
                <th className="fw-bold text-dark">Address</th>
                <th className="fw-bold text-dark">Phone Number</th>
                <th className="fw-bold text-dark">Email</th>
                <th className="fw-bold text-dark">Website</th>
                <th className="fw-bold text-dark">Country</th>
                <th className="fw-bold text-dark">Currency</th>
              </tr>
            </thead>

            <tbody>
              {banksData.map((bank, index) => (
                <tr
                  key={index}
                  className="border-bottom"
                  style={{ borderColor: "#D3D3D3" }}
                >
                  <td className="fw-medium">{bank.name}</td>
                  <td className="fw-medium">{bank.code}</td>
                  <td>{bank.address}</td>
                  <td>{bank.phone}</td>
                  <td>{bank.email}</td>
                  <td>
                    <a
                      href={`https://${bank.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-decoration-none"
                      style={{ color: "#8B0000", fontWeight: "500" }}
                    >
                      {bank.website}
                    </a>
                  </td>
                  <td className="fw-medium">{bank.country}</td>
                  <td className="fw-medium">{bank.currency}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AllBanks;
