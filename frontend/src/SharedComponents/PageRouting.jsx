import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import { AuthProvider } from "./authContext";

const Homepage = lazy(() => import("../EverythingForHomepage/Homepage"));
const Authpage = lazy(() => import("../EverythingForAuthentication/Authenticationpage"));

const Accountpage = lazy(() => import("../EverythingForAccountpage/Accountpage"));
const AccountpageOtherUsers = lazy(() => import("../EverythingForAccountpage/AccountpageOtherUsers"));
const Postpage = lazy(() => import('../EverythingForPostpage/Postpage'));
const PostReviewpage = lazy(() => import('../EverythingForPostReviewpage/PostReviewpage'));
const Commentpage = lazy(() => import('../EverythingForCommentpage/Commentpage'));
const Glossarypage = lazy(() => import("../EverythingForGlossaryPage/GlossaryPage"));
const Forumpage = lazy(() => import("../EverythingForForumpage/Forumpage"));
const NotFound = lazy(() => import("./NotFound"));

const Quizpage = lazy(() => import("../Quiz/Pages/Quizpage"));
const Resultpage = lazy(() => import("../Quiz/Pages/Resultpage"));
const Detailpage = lazy(() => import("../Quiz/Pages/Detailpage"));
const Catalogpage = lazy(() => import("../Quiz/Pages/Catalogpage"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 d-flex align-items-center justify-content-center">
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">Loading page...</p>
    </div>
  </div>
);

function PrefetchPages() {
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (location.pathname === '/') {
        import("../EverythingForForumpage/Forumpage");
        import("../Quiz/Pages/Catalogpage");
        import("../Quiz/Pages/Detailpage");
        import("./NotFound");
      }
      
      if (location.pathname === '/forum') {
        import('../EverythingForPostpage/Postpage');
        import('../EverythingForPostReviewpage/PostReviewpage');
        import('../EverythingForCommentpage/Commentpage');
        import('../EverythingForAccountpage/AccountpageOtherUsers');
      }
      
      import("../EverythingForAccountpage/Accountpage");
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}

function PageRouting() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <AuthProvider>
          <PrefetchPages />
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/auth' element={<Authpage />} />
            <Route path='/quizpage' element={<Quizpage />} />
            <Route path='/result' element={<Resultpage />} />
            <Route path='/account' element={<Accountpage />} />
            <Route path='/user/:username' element={<AccountpageOtherUsers />} />
            <Route path='/detail/:id' element={<Detailpage />} />
            <Route path='/catalog' element={<Catalogpage />} />
            <Route path='/post' element={<Postpage />} />
            <Route path='/postEdit/:id' element={<Postpage />} />
            <Route path='/post/:id' element={<PostReviewpage />} />
            <Route path='/post/:postId/comment' element={<Commentpage />} />
            <Route path='/post/:postId/comment/:commentId' element={<Commentpage />} />
            <Route path='/glossary' element={<Glossarypage />} />
            <Route path='/forum' element={<Forumpage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default PageRouting;