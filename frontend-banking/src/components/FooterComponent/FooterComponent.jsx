import React from "react";
import { useNavigate } from "react-router-dom";

const FooterComponent = () => {
  const navigate = useNavigate();

  return (
    <footer style={styles.footer}>
      {/* Columns */}
      <div style={styles.linksContainer}>
        {/* Column 1 - Slogan */}
        <div style={styles.column}>
          <h4 style={styles.heading}>ONLINE BANKING SYSTEM</h4>
          <p style={styles.text}>
            Seamlessly navigate your financial journey. Initiate secure transactions,
            deposit funds, and withdraw effortlessly.
          </p>
        </div>

        {/* Column 2 - About Us */}
        <div style={styles.column}>
          <h4 style={styles.heading}>ABOUT US</h4>
          <ul style={styles.list}>
            <li><a href="#">Our Mission</a></li>
            <li><a href="#">Team</a></li>
            <li><a href="#">Testimonials</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        {/* Column 3 - Contact */}
        <div style={styles.column}>
          <h4 style={styles.heading}>CONTACT US</h4>
          <ul style={styles.list}>
            <li><a href="#">Email</a></li>
            <li><a href="#">Phone</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Locations</a></li>
          </ul>
        </div>

        {/* Column 4 - Careers */}
        <div style={styles.column}>
          <h4 style={styles.heading}>CAREERS</h4>
          <ul style={styles.list}>
            <li><a href="#">Open Positions</a></li>
            <li><a href="#">Internships</a></li>
            <li><a href="#">Benefits</a></li>
            <li><a href="#">Culture</a></li>
          </ul>
        </div>

        {/* Column 5 - Links */}
        <div style={styles.column}>
          <h4 style={styles.heading}>LINKS</h4>
          <ul style={styles.list}>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom row */}
      <div style={styles.bottomRow}>
        {/* Login Button */}
        <div style={{ marginBottom: "10px" }}>
          <span style={{ marginRight: "10px" }}>Login from here:</span>
          <button
            style={styles.loginButton}
            onClick={() => navigate("/user/login")}
          >
            Log in
          </button>
        </div>

        {/* Copyright */}
        <p style={styles.copyright}>
          © 2026 Online Banking System. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    width: "100%",
    backgroundColor: "#F5F5DC",
    color: "#8B0000",
    padding: "40px 5%",
    fontFamily: "Georgia, serif",
    boxSizing: "border-box",
  },
  linksContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "30px",
  },
  column: {
    flex: "1 1 180px",
    minWidth: "150px",
  },
  heading: {
    fontSize: "16px",
    marginBottom: "10px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  text: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#5a0000",
  },
  list: {
    listStyle: "none",
    padding: 0,
    fontSize: "14px",
  },
  bottomRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderTop: "1px solid #D3D3D3",
    paddingTop: "15px",
    gap: "10px",
  },
  loginButton: {
    backgroundColor: "#8B0000",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    fontSize: "0.9rem",
    fontWeight: "600",
    borderRadius: "5px",
    cursor: "pointer",
  },
  copyright: {
    fontSize: "12px",
    color: "#5a0000",
    margin: 0,
  },
};

export default FooterComponent;
