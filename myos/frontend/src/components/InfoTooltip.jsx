import { useState } from "react";
import { Link } from "react-router-dom";

const InfoTooltip = ({ text, link }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      style={{ position: "relative", cursor: "help", marginLeft: "6px", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <i className="bi bi-question-circle" style={{ color: "#007bff", fontSize: "0.85rem" }}></i>

      {visible && (
        <div style={{
          position: "absolute",
          bottom: "130%",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#2d3436",
          color: "#ffffff",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "0.85rem",
          width: "240px",
          zIndex: 9999,
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          textAlign: "left"
        }}>
          <div style={{ marginBottom: link ? "8px" : "0" }}>{text}</div>

          {link && (
            <Link
              to={link}
              style={{
                color: "#74b9ff",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "0.8rem",
                display: "block",
                borderTop: "1px solid #636e72",
                paddingTop: "6px"
              }}
            >
              Learn more in the Glossary ↗
            </Link>
          )}

          <div style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            border: "7px solid transparent",
            borderTopColor: "#2d3436"
          }}></div>
        </div>
      )}
    </span>
  );
};

export default InfoTooltip;
