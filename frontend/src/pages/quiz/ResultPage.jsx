import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";
import { Results, PDFButton } from "../../features/quiz/components/ResultComponents.jsx";
import { useResult } from "../../features/quiz/hooks/useResult.js";
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const res = useResult();
  const navigate = useNavigate();

  if (!res.results.length) {
    return (
      <>
        <Navbar />
        <main className="container py-5">
          <div className="alert alert-info" role="status">
            No recommendations are available yet. Try the quiz again or browse
            the catalog.
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={() => navigate("/quizpage")}>
              Start the quiz
            </button>
            <button className="btn btn-outline-primary" onClick={() => navigate("/catalog")}>
              Browse catalog
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const hasMatches = res.results.some((distro) => distro.match_score > 0);

  return (
    <>
      <Navbar />
      <main className="container py-4">
        <div>
          {!hasMatches && (
            <div className="alert alert-info" role="status">
              No exact matches were found. Here are the closest options in the catalog.
            </div>
          )}

          <div className="result-header d-flex flex-wrap justify-content-between align-items-center mb-4">
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
