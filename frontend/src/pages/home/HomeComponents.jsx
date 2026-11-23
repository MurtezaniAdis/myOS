import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Homepage.css";

import step1 from "../../pics/step1.png";
import step2 from "../../pics/step2.png";
import step3 from "../../pics/step3.png";

import forum from "../../pics/forum.png";

import { useAuth } from "../../context/AuthContext.jsx";
import { getDistros } from "../../features/quiz/api/catalogApi.js";
import { getDistroLogo } from "../../utils/getDistroLogo.js";

const FEATURED_DISTRO_NAMES = [
  "Windows 11",
  "Ubuntu",
  "Windows 10",
  "CachyOS",
  "Linux Mint",
];

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

        <div className="d-flex flex-wrap justify-content-center gap-3">
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
  const [topDistros, setTopDistros] = useState([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getDistros()
      .then((distros) => {
        if (cancelled) return;

        const byName = new Map(
          distros.map((distro) => [distro.name.toLowerCase(), distro]),
        );
        const preferred = FEATURED_DISTRO_NAMES.map((name) =>
          byName.get(name.toLowerCase()),
        ).filter(Boolean);
        const preferredIds = new Set(preferred.map((distro) => distro.id));
        const remaining = distros.filter(
          (distro) => !preferredIds.has(distro.id),
        );

        setTopDistros([...preferred, ...remaining].slice(0, 5));
        setIsCatalogLoading(false);
      })
      .catch((error) => {
        console.error("Could not load featured distributions:", error);
        if (!cancelled) {
          setCatalogError("Could not load the operating system catalog.");
          setIsCatalogLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container mt-5">
      <h4 className="mb-4">Top 5 popular operating systems</h4>

      <div className="row align-items-center">
        <div className="col-md-8">
          <div className="row text-center">
            {topDistros.map((os, index) => {
              const logo = getDistroLogo(os);

              return (
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
                    {logo ? (
                      <img
                        src={logo}
                        alt={os.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-muted">{os.name}</span>
                    )}
                  </div>
                  <small>
                    {index + 1}. {os.name}
                  </small>
                </div>
              );
            })}
          </div>
          {catalogError && (
            <p className="alert alert-warning">{catalogError}</p>
          )}
          {isCatalogLoading && (
            <p className="text-muted">Loading operating systems...</p>
          )}
          {!isCatalogLoading && !catalogError && topDistros.length === 0 && (
            <p className="text-muted">No operating systems are available yet.</p>
          )}
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
