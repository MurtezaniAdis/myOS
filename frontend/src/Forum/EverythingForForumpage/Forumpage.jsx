import NAVBAR from "../../SharedComponents/NavbarComponent.jsx";
import Footer from "../../SharedComponents/FooterComponent.jsx";
import { useNavigate } from "react-router-dom";
import { ForumHeader, Posts } from "./ForumpageComponents.jsx";
import { useForum } from "./useForum.js";
import { useAuth } from "../../SharedComponents/authContext.jsx";

function Forumpage() {
  const navigate = useNavigate();
  const forum = useForum();
  const user = useAuth();

  if (forum.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading forum...</div>
      </div>
    );
  }

  return (
    <>
      <NAVBAR />

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
              user={user}
              onClickComments={(postId) => navigate("/post/" + postId)}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Forumpage;
