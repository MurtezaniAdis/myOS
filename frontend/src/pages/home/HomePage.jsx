import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { HeroBlock, TopOsAndForum } from "./HomeComponents.jsx";

function HomePage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 pb-5">
        <HeroBlock />
        <TopOsAndForum />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
