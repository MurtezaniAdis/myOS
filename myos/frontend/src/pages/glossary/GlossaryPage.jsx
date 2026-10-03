import { useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { categories, desktops } from "./glossaryData.js";

function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCats = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDEs = desktops.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollto = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <main>
        <div
          className="container"
          style={{ color: "#004E72", marginTop: "8rem", marginBottom: "5rem" }}
        >
          <h2 className="mb-4">
            <b>Glossary</b>
          </h2>

          <div className="mb-5">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: "1rem", border: "2px solid #f0f7fa" }}
            />
          </div>

          <div className="row">
            <div className="col-md-3 mb-4">
              <div
                className="p-4 rounded-4 sticky-top"
                style={{ backgroundColor: "#f0f7fa", top: "9rem" }}
              >
                <h5>
                  <b>Table of Contents</b>
                </h5>
                <ul className="list-unstyled mt-3">
                  <li className="mb-2">
                    <button
                      onClick={() => scrollto("categories-section")}
                      className="btn btn-link p-0 text-decoration-none"
                      style={{ color: "#004E72" }}
                    >
                      1. Categories
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollto("desktop-section")}
                      className="btn btn-link p-0 text-decoration-none"
                      style={{ color: "#004E72" }}
                    >
                      2. Desktop Environments
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-9">
              <section id="categories-section" className="mb-5">
                <h3 className="border-bottom pb-2 mb-4">Categories</h3>
                <div className="row g-3">
                  {filteredCats.length > 0 ? (
                    filteredCats.map((cat) => (
                      <div key={cat.id} className="col-12">
                        <div className="p-3 border-start border-4 border-primary bg-white shadow-sm rounded">
                          <strong>{cat.name}</strong>
                          <p
                            className="mb-0 text-muted"
                            style={{ fontSize: "10pt" }}
                          >
                            {cat.desc}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No categories match your search.</p>
                  )}
                </div>
              </section>

              <section id="desktop-section">
                <h3 className="border-bottom pb-2 mb-4">Desktop Environments</h3>
                <div className="row g-3">
                  {filteredDEs.length > 0 ? (
                    filteredDEs.map((de) => (
                      <div key={de.id} className="col-12">
                        <div className="p-3 border-start border-4 border-info bg-white shadow-sm rounded">
                          <strong>{de.name}</strong>
                          <p
                            className="mb-0 text-muted"
                            style={{ fontSize: "10pt" }}
                          >
                            {de.desc}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No desktops match your search.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default GlossaryPage;
