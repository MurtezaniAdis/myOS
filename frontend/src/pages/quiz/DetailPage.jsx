import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import { Infobar, Links, Logo } from "../../features/quiz/components/DetailComponents.jsx";
import { useDetail } from "../../features/quiz/hooks/useDetail.js";

function DetailPage() {
  const location = useLocation();
  const origin = location.state?.from;
  const detail = useDetail();

  if (detail.loading || !detail.distro) {
    return (
      <>
        <Navbar />
        <div
          className="container"
          style={{ marginTop: "8rem", textAlign: "center" }}
        >
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading Operating System...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <div
          className="container"
          style={{ color: "#004E72", marginTop: "8rem" }}
        >
          <div className="row justify-content-between gap-5 pb-4">
            <div className="col-md-7">
              <Infobar
                distro={detail.distro}
                isFavorite={detail.isFavorite}
                handleToggleFavorite={detail.handleToggleFavorite}
              />

              <Links distro={detail.distro} />
            </div>

            <Logo distro={detail.distro} />
          </div>

          <div className="mt-5 pb-5">
            <button
              className="primaryButton px-4 py-2"
              onClick={detail.handleBackClick}
              style={{ borderRadius: "0.6rem", color: "#FEFEFE" }}
            >
              {origin === "catalog" ? "← Back to Catalog" : "← Back"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default DetailPage;
