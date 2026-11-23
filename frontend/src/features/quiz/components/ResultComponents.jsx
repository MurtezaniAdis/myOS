import { getDistroLogo } from "../../../utils/getDistroLogo.js";

export function Results({ distro, onClickDistro }) {
  const logoUrl = getDistroLogo(distro);

  return (
    <div className="card-body">
      <div className="d-flex justify-content-center justify-content-sm-start mb-3">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${distro.name} logo`}
            referrerPolicy="no-referrer"
            className="result-logo"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span className="text-muted">No logo available</span>
        )}
      </div>
      <h5 className="card-title">{distro.name}</h5>
      <p className="card-text">{distro.description}</p>
      <p>
        <strong>Category:</strong> {(distro.category || "General purpose").split(",").join(", ")}
      </p>
      <p>
        <strong>Price:</strong> {distro.price}
      </p>
      {distro.security_info && (
        <p>
          <strong>Security Hardening: </strong>
          <a
            href={distro.security_info.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {distro.security_info.label}
          </a>
        </p>
      )}
      <p>
        <strong>Installation Video: </strong>
        <a
          href={distro.install_video}
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch on YouTube
        </a>
      </p>
      <p>
        <strong>Match Score:</strong> {distro.match_percent ?? distro.match_score}%
      </p>
      <button className="btn btn-primary mt-3" onClick={() => onClickDistro()}>
        More Details
      </button>
    </div>
  );
}

export function PDFButton({ handleDownloadPDF, isGeneratingPDF }) {
  return (
    <button
      className="btn btn-primary mt-3"
      onClick={handleDownloadPDF}
      disabled={isGeneratingPDF}
    >
      {isGeneratingPDF ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Generating PDF...
        </>
      ) : (
        <>Save as PDF</>
      )}
    </button>
  );
}
