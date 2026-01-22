import Navbar from "../../SharedComponents/NavbarComponent.jsx";
import { useNavigate } from "react-router-dom";
import Footer from "../../SharedComponents/FooterComponent.jsx";
import { Searchbar, AllDistros } from "../Components/CatalogpageComponents.jsx";
import { useCatalog } from "../HooksAndLogic/useCatalog.js";

function Catalogpage() {
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

export default Catalogpage;
