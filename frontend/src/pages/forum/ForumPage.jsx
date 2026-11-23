import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { ForumHeader, Posts } from "./ForumComponents.jsx";
import { useForum } from "./useForum.js";

function ForumPage() {
  const navigate = useNavigate();
  const forum = useForum();

  if (forum.loading) {
    return (
      <>
        <Navbar />
        <main className="container py-5 text-center">Loading forum...</main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <ForumHeader
              onClickBack={() => navigate("/")}
              onClickPost={forum.handleCreatePost}
            />

            <Posts
              posts={forum.posts}
              handleUserClick={forum.handleUserClick}
              onClickComments={(postId) => navigate("/post/" + postId)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ForumPage;
