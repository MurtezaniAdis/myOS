import NAVBAR from "../../SharedComponents/NavbarComponent.jsx";
import Footer from "../../SharedComponents/FooterComponent.jsx";
import { Infobar, Links, Logo } from "../Components/DetailpageComponents.jsx";
import {useDetail} from "../HooksAndLogic/useDetail.js";

function Detailpage() {
  const detail = useDetail();
 
  if (detail.loading || !detail.distro) {
    return (
      <>
        <NAVBAR />
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
      <NAVBAR />
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

export default Detailpage;
