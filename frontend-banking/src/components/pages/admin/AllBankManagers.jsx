import React, { useEffect, useState } from "react";
import { Container, Card, Table } from "react-bootstrap";
import axios from "axios";

const AllBankManagers = () => {
  const [managersData, setManagersData] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/bank/managers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setManagersData(res.data);
      })
      .catch((err) => {
        console.error("Failed to load managers", err);
      });
  }, []);

  return (
    <Container className="py-5" fluid>
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
        <Card.Header
          className="text-center fw-bold p-4 fs-3"
          style={{
            backgroundColor: "#8B0000",
            color: "white",
            borderRadius: "8px 8px 0 0",
          }}
        >
          All Bank Managers
        </Card.Header>

        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead>
              <tr style={{ backgroundColor: "rgba(139,0,0,0.1)" }}>
                <th>Bank Name</th>
                <th>Manager Name</th>
                <th>Email Id</th>
                <th>Gender</th>
                <th>Contact No</th>
                <th>Street</th>
                <th>City</th>
                <th>Pincode</th>
              </tr>
            </thead>

            <tbody>
              {managersData.map((manager, index) => (
                <tr key={index}>
                  <td>{manager.bankName}</td>
                  <td>{manager.name}</td>
                  <td>{manager.email}</td>
                  <td>{manager.gender}</td>
                  <td>{manager.contact}</td>
                  <td>{manager.street}</td>
                  <td>{manager.city}</td>
                  <td>{manager.pincode}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AllBankManagers;
