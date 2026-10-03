import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { Searchbar, AllDistros } from "../../features/quiz/components/CatalogComponents.jsx";
import { useCatalog } from "../../features/quiz/hooks/useCatalog.js";

function CatalogPage() {
  const catalog = useCatalog();
  const navigate = useNavigate();

  if (catalog.loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" />
      </div>
    );
  if (catalog.error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{catalog.error}</div>
      </div>
    );

  return (
    <>
      <Navbar />
      <main>
        <div className="container mt-5">
          <h2 className="mb-3">Distro Library</h2>

          <Searchbar search={catalog.search} setSearch={catalog.setSearch} />

          <AllDistros
            filteredDistros={catalog.filteredDistros}
            onSelectDistro={(distro) =>
              navigate(`/detail/${distro.id}`, {
                state: { distro, from: "catalog" },
              })
            }
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CatalogPage;
