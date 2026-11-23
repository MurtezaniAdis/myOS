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
      <>
        <Navbar />
        <main className="container py-5 text-center">
          <div className="spinner-border" />
        </main>
        <Footer />
      </>
    );
  if (catalog.error)
    return (
      <>
        <Navbar />
        <main className="container page-container">
          <div className="alert alert-danger">{catalog.error}</div>
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="container">
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
