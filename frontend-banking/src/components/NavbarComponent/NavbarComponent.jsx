import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaUniversity } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const role = localStorage.getItem("role"); // null | CUSTOMER | ADMIN | BANK MANAGER
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/");
  };

  const navLinkStyle = ({ isActive }) => ({
    color: "#8B0000",
    fontWeight: isActive ? "700" : "500",
    marginRight: "15px",
    textDecoration: "none",
  });

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        {/* LEFT SIDE */}
        <Nav className="d-flex align-items-center">
          <FaUniversity size={30} color="#8B0000" className="me-2" />

          <NavLink
            to="/"
            style={{
              color: "#8B0000",
              fontSize: "1.2rem",
              fontFamily: "Georgia, serif",
              fontWeight: "700",
              marginRight: "20px",
              textDecoration: "none",
            }}
          >
            Online Banking System
          </NavLink>

          <NavLink to="/about" style={navLinkStyle}>
            About
          </NavLink>

          <NavLink to="/contact" style={navLinkStyle}>
            Contact
          </NavLink>
        </Nav>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="align-items-center">

           {/* 👤 GUEST */}
{!role && (
  <>
    <NavLink
      to="/user/login"
      style={{
        color: "#8B0000",
        fontWeight: "700",
        marginRight: "15px",
        textDecoration: "none",
      }}
    >
      Login
    </NavLink>

    <NavLink
      to="/user/admin/register"
      style={{
        color: "#8B0000",
        fontWeight: "700",
        textDecoration: "none",
      }}
    >
      Register
    </NavLink>
  </>
)}
{/* 👤 CUSTOMER */}
{role === "CUSTOMER" && (
  <>
    <NavLink
      to="/customer/account/transfer"
      style={navLinkStyle}
    >
      Money Transfer
    </NavLink>

    <NavLink
      to="/customer/bank/account/detail"
      style={navLinkStyle}
    >
      Bank Account
    </NavLink>

    <NavLink
      to="/customer/bank/account/statement"
      style={navLinkStyle}
    >
      Transaction History
    </NavLink>

    <span
      onClick={logoutHandler}
      style={{
        color: "red",
        fontWeight: "700",
        cursor: "pointer",
        marginLeft: "10px"
      }}
    >
      Logout
    </span>
  </>
)}


           {/* 👤 BANK MANAGER NAVBAR */}
{role === "BANK" && (
  <>
    {/* Register Customer */}
    <NavLink to="/user/customer/register" style={navLinkStyle}>
      Register Customer
    </NavLink>

    {/* Bank Accounts */}
    <NavLink to="/bank/account/all" style={navLinkStyle}>
      Bank Accounts
    </NavLink>

    {/* Bank Customers */}
    <NavLink to="/bank/customer/all" style={navLinkStyle}>
      Bank Customers
    </NavLink>

    {/* Customer Transactions */}
    <NavLink to="/bank/customer/account/transactions" style={navLinkStyle}>
      Customer Transactions
    </NavLink>

    {/* Logout */}
    <span
      onClick={logoutHandler}
      style={{
        color: "red",
        fontWeight: "700",
        cursor: "pointer",
        marginLeft: "10px"
      }}
    >
      Logout
    </span>
  </>
)}


            {/* 🛡️ ADMIN */}
            {role === "ADMIN" && (
              <>
                <NavLink to="/admin/bank/register" style={navLinkStyle}>
                  Register Bank Manager
                </NavLink>

                <NavLink to="/admin/bank/add" style={navLinkStyle}>
                  Add Bank
                </NavLink>

                <NavLink to="/admin/bank/all" style={navLinkStyle}>
                  View Banks
                </NavLink>

                <NavLink to="/admin/bank/managers" style={navLinkStyle}>
                  Bank Managers
                </NavLink>

                <NavLink to="/admin/allbank/customers" style={navLinkStyle}>
                  All Customers
                </NavLink>

                <NavLink to="/admin/bank/account/all" style={navLinkStyle}>
                  All Bank Accounts
                </NavLink>

                <NavLink
                  to="/admin/bank/transactions"
                  style={navLinkStyle}
                >
                  All Bank Transactions
                </NavLink>

                <span
                  onClick={logoutHandler}
                  style={{
                    color: "red",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </span>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
