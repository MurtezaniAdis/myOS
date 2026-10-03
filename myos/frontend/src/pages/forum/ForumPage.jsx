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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading forum...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container py-4">
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
      </div>
      <Footer />
    </>
  );
}

export default ForumPage;
