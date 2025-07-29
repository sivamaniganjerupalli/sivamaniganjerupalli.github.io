// src/pages/NotFound.js

import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.text}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={styles.link}>Go to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "100px 20px",
    backgroundColor: "#f8f8f8",
    height: "100vh"
  },
  heading: {
    fontSize: "48px",
    color: "#ff4d4d",
  },
  text: {
    fontSize: "20px",
    margin: "20px 0",
  },
  link: {
    fontSize: "18px",
    color: "#007bff",
    textDecoration: "none",
    border: "1px solid #007bff",
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#ffffff"
  }
};

export default NotFound;
