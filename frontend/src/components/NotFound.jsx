import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center py-5 text-center">
        <h1 className="display-1 text-danger">404</h1>
        <p className="fs-4">Site not found</p>
        <div className="mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/")}
          >
            Back to homepage
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/quizpage")}
          >
            To Quiz
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default NotFound;
