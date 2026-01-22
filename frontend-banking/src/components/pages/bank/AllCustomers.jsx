import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Table,
  Button,
  InputGroup,
  FormControl,
  Spinner,
  Alert,
} from "react-bootstrap";

const AllCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomersData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 🔹 DELETE CUSTOMER
  const deleteCustomer = async (email) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customer/delete?email=${email}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to delete customer");

      // 🔄 Remove from frontend instantly
      setCustomersData((prev) => prev.filter((c) => c.email !== email));
      alert("Customer deleted successfully");
    } catch {
      alert("Failed to delete customer");
    }
  };

  const filteredCustomers = customersData.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const thStyle = {
    backgroundColor: "#8B0000",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
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
          fontFamily: "Georgia, serif",
        }}
      >
        <Card.Header
          className="text-center fw-bold fs-3 p-4"
          style={{ backgroundColor: "#8B0000", color: "#fff" }}
        >
          All Bank Customers
        </Card.Header>

        <Card.Body>
          <InputGroup className="mb-4 mx-auto" style={{ maxWidth: "300px" }}>
            <FormControl
              placeholder="Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "2px solid #8B0000" }}
            />
            <Button style={{ backgroundColor: "#8B0000", border: "none" }}>
              Search
            </Button>
          </InputGroup>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
            </div>
          ) : (
            <Table bordered hover responsive className="text-center">
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Bank</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Contact</th>
                  <th style={thStyle}>City</th>
                  <th style={thStyle}>Account</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c, i) => (
                    <tr key={i}>
                      <td>{c.name}</td>
                      <td>{c.bank}</td>
                      <td>{c.email}</td>
                      <td>{c.contact}</td>
                      <td>{c.city}</td>

                      <td>
                        {c.status === "ACTIVE" ? (
                          <Button
                            size="sm"
                            style={{ backgroundColor: "#8B0000", border: "none" }}
                            onClick={() =>
                              navigate("/bank/account/customer/detail", { state: { email: c.email } })
                            }
                          >
                            View Account
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            style={{ backgroundColor: "#006400", border: "none" }}
                            onClick={() =>
                              navigate("/bank/customer/account/add", { state: { email: c.email } })
                            }
                          >
                            Add Account
                          </Button>
                        )}
                      </td>

                      <td>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "12px",
                            backgroundColor: c.status === "ACTIVE" ? "#d4edda" : "#f8d7da",
                            color: c.status === "ACTIVE" ? "#155724" : "#721c24",
                            fontWeight: "600",
                          }}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td>
                        <Button
                          size="sm"
                          style={{ backgroundColor: "#DC143C", border: "none" }}
                          onClick={() => deleteCustomer(c.email)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AllCustomers;
