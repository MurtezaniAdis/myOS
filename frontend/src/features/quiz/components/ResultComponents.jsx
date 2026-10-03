import { getDistroLogo } from "../../../utils/getDistroLogo.js";

export function Results({ distro, onClickDistro }) {
  const logoUrl = getDistroLogo(distro);

  return (
    <div className="card-body">
      <div className="ms-5 d-none d-sm-block">
        <img
          src={logoUrl}
          alt={`${distro.name} logo`}
          referrerPolicy="no-referrer"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "contain",
            marginBottom: "60px",
            marginTop: "50px",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
      <h5 className="card-title">{distro.name}</h5>
      <p className="card-text">{distro.description}</p>
      <p>
        <strong>Category:</strong> {distro.category.split(",").join(", ")}
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
        <strong>Match Score:</strong> {distro.match_score}%
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
