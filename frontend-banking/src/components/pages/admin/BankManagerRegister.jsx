import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, Spinner } from 'react-bootstrap';

const BankManagerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    contactNo: '',
    age: '',
    street: '',
    city: '',
    pincode: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate all fields
    if (!Object.values(formData).every(val => val)) {
      setError('Please fill all fields');
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // ✅ Get JWT token from localStorage (set on admin login)
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Admin not logged in. Please login first.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/bank-manager/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // ✅ send JWT
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Registration failed');
      }

      const result = await response.json(); // backend returns JSON
      setSuccess(result.message); // show success message
      setFormData({
        name: '',
        email: '',
        password: '',
        gender: '',
        contactNo: '',
        age: '',
        street: '',
        city: '',
        pincode: ''
      });

    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 py-5"
      style={{ backgroundColor: '#f8f8f8' }}
    >
      <Card
        className="shadow-lg"
        style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: '#F5F5DC',
          border: '3px solid #8B0000',
          borderRadius: '12px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <Card.Body className="px-4 py-4">
          <h3
            className="fw-bold text-center mb-4 py-3"
            style={{
              backgroundColor: '#8B0000',
              color: '#fff',
              borderRadius: '8px 8px 0 0',
              margin: '-1.5rem -1.5rem 2rem -1.5rem',
              letterSpacing: '1px',
            }}
          >
            Register Bank Manager
          </h3>

          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          {success && <Alert variant="success" className="mb-4">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              {/* Name */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-medium">Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    size="lg"
                    className="py-2"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Email */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-medium">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    size="lg"
                    className="py-2"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Password & Gender */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    size="lg"
                    className="py-2"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium">Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    size="lg"
                    className="py-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Contact & Age */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium">Contact No</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    size="lg"
                    className="py-2"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium">Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    size="lg"
                    className="py-2"
                    required
                  />
                </Form.Group>
              </Col>

              {/* Street, City, Pin */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-medium">Street</Form.Label>
                  <Form.Control
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Enter street"
                    size="lg"
                    className="py-2"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-medium">City</Form.Label>
                  <Form.Control
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    size="lg"
                    className="py-2"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-medium">Pin</Form.Label>
                  <Form.Control
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter PIN"
                    size="lg"
                    className="py-2"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              type="submit"
              className="w-100 fw-bold py-3 mt-4"
              style={{
                backgroundColor: '#8B0000',
                borderColor: '#8B0000',
                fontSize: '1.05rem',
                borderRadius: '0 0 8px 8px',
                letterSpacing: '0.5px',
              }}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Register'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BankManagerRegister;
