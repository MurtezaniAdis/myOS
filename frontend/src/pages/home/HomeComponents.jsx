import { useNavigate } from "react-router-dom";
import "../../styles/Homepage.css";

import step1 from "../../pics/step1.png";
import step2 from "../../pics/step2.png";
import step3 from "../../pics/step3.png";

import windows10 from "../../pics/windows.png";
import windows11 from "../../pics/windows 11.png";
import mint from "../../pics/mint.png";
import ubuntu from "../../pics/ubuntu.png";
import cachyos from "../../pics/cachyos.png";
import forum from "../../pics/forum.png";

import { useAuth } from "../../context/AuthContext.jsx";

export function HeroBlock() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg rounded-4 p-4 text-center bg-info bg-opacity-25"
        style={{ background: "#b3e5fc" }}
      >
        <h3 className="mb-4" style={{ color: "#004e72" }}>
          Answer questions and get operating systems
        </h3>

        <div className="row text-center mb-4">
          <div className="col-md-4">
            <img
              src={step1}
              alt="Create account"
              className="d-block mx-auto mb-3"
              style={{ width: 80, height: 80 }}
            />
            <p style={{ color: "#004e72" }}>
              <strong>1.</strong> Create an account
            </p>
          </div>

          <div className="col-md-4">
            <img
              src={step2}
              alt="Answer questions"
              className="d-block mx-auto mb-3"
              style={{ width: 80, height: 80 }}
            />
            <p style={{ color: "#004e72" }}>
              <strong>2.</strong> Answer some questions
            </p>
          </div>

          <div className="col-md-4">
            <img
              src={step3}
              alt="Get OS suggestions"
              className="d-block mx-auto mb-3"
              style={{ width: 80, height: 80 }}
            />
            <p style={{ color: "#004e72" }}>
              <strong>3.</strong> We suggest the best OS for you
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="primaryButton px-4 py-2"
            onClick={() => navigate("/quizpage")}
            style={{ color: "#FEFEFE", borderRadius: "0.6rem" }}
          >
            Get Started
          </button>

          <button
            className="secondaryButton px-4 py-2"
            style={{ borderRadius: "0.6rem" }}
            onClick={() => navigate(user ? "/account" : "/auth")}
          >
            {user ? "My Account" : "Log In"}
          </button>

          <button
            className="secondaryButton px-4 py-2"
            style={{ borderRadius: "0.6rem" }}
            onClick={() => navigate("/catalog")}
          >
            Look at Catalog
          </button>
        </div>
      </div>
    </div>
  );
}

export function TopOsAndForum() {
  const navigate = useNavigate();

  const topDistros = [
    { id: 377, name: "Windows 11", img: windows11 },
    { id: 9, name: "Ubuntu", img: ubuntu },
    { id: 378, name: "Windows 10", img: windows10 },
    { id: 1, name: "CachyOS", img: cachyos },
    { id: 2, name: "Linux Mint", img: mint },
  ];

  return (
    <div className="container mt-5">
      <h4 className="mb-4">Top 5 popular operating systems</h4>

      <div className="row align-items-center">
        <div className="col-md-8">
          <div className="row text-center">
            {topDistros.map((os, index) => (
              <div
                className="col-6 col-md-2 mb-4 d-flex flex-column align-items-center"
                key={os.id}
                onClick={() => navigate(`/detail/${os.id}`, { state: { from: "home" } })}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="bg-light rounded d-flex justify-content-center align-items-center mb-2"
                  style={{ width: 80, height: 80 }}
                >
                  <img
                    src={os.img}
                    alt={os.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <small>
                  {index + 1}. {os.name}
                </small>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card shadow-sm p-4 text-center bg-primary text-white rounded-4"
            onClick={() => navigate("/forum")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={forum}
              alt="Forum"
              className="d-block mx-auto mb-3"
              style={{ width: 80, height: 80 }}
            />
            <h5>Forum</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
