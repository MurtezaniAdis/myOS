import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-light border-top mt-auto py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 text-muted">
              &copy; {new Date().getFullYear()} <strong>myOS</strong>.
              Built for the community.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <Link
              to="/catalog"
              className="text-decoration-none text-muted me-4"
            >
              <i className="bi bi-grid-3x3-gap me-1"></i> Catalog
            </Link>

            <Link
              to="/glossary"
              className="text-decoration-none text-muted me-4"
            >
              <i className="bi bi-book me-1"></i> Glossary
            </Link>

            <a
              href="https://discord.gg/dzfmZtAuJ3"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm text-white px-3"
              style={{ background: "#5865F2" }}
            >
              <i className="bi bi-discord me-2"></i> Join MyOS Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
