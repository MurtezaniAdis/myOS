import Footer from "../../SharedComponents/FooterComponent.jsx";
import Navbar from "../../SharedComponents/NavbarComponent.jsx";
import { Results, PDFButton } from "../Components/ResultBlockComponent.jsx";
import { useResult } from "../HooksAndLogic/useResult.js";
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const res = useResult();
  const navigate = useNavigate();
  
  if (!res.results.length) return <p>No results found.</p>;

  return (
    <>
      <Navbar />
      <main>
        <div className="container mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Top 3 Recommendations</h2>

            <PDFButton
              handleDownloadPDF={res.handleDownloadPDF}
              isGeneratingPDF={res.isGeneratingPDF}
            />
          </div>

          {res.results.map((distro, index) => (
            <div key={index} className="card mb-3">
              <Results
              distro={distro}
              onClickDistro={() =>
                navigate(`/detail/${distro.id}`, {
                  state: { distro, from: "results" },
                })
              }
              />
            </div>
          ))}

          <div className="text-center mt-4 mb-5">
            <PDFButton
              handleDownloadPDF={res.handleDownloadPDF}
              isGeneratingPDF={res.isGeneratingPDF}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ResultPage;
