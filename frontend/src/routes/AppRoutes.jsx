import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";

const HomePage = lazy(() => import("../pages/home/HomePage.jsx"));
const AuthPage = lazy(() => import("../pages/auth/AuthPage.jsx"));

const AccountPage = lazy(() => import("../pages/account/AccountPage.jsx"));
const UserProfilePage = lazy(() => import("../pages/account/UserProfilePage.jsx"));
const GlossaryPage = lazy(() => import("../pages/glossary/GlossaryPage.jsx"));
const NotFound = lazy(() => import("../components/NotFound.jsx"));

const QuizPage = lazy(() => import("../pages/quiz/QuizPage.jsx"));
const ResultPage = lazy(() => import("../pages/quiz/ResultPage.jsx"));
const DetailPage = lazy(() => import("../pages/quiz/DetailPage.jsx"));
const CatalogPage = lazy(() => import("../pages/quiz/CatalogPage.jsx"));

const ForumPage = lazy(() => import("../pages/forum/ForumPage.jsx"));
const PostEditorPage = lazy(() => import("../pages/forum/PostEditorPage.jsx"));
const PostDetailPage = lazy(() => import("../pages/forum/PostDetailPage.jsx"));
const CommentEditorPage = lazy(() => import("../pages/forum/CommentEditorPage.jsx"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 d-flex align-items-center justify-content-center">
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
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
      if (location.pathname === "/") {
        import("../pages/forum/ForumPage.jsx");
        import("../pages/quiz/CatalogPage.jsx");
        import("../pages/quiz/DetailPage.jsx");
        import("../components/NotFound.jsx");
      }

      if (location.pathname === "/forum") {
        import("../pages/forum/PostEditorPage.jsx");
        import("../pages/forum/PostDetailPage.jsx");
        import("../pages/forum/CommentEditorPage.jsx");
        import("../pages/account/UserProfilePage.jsx");
      }

      import("../pages/account/AccountPage.jsx");
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <AuthProvider>
          <PrefetchPages />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/quizpage" element={<QuizPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/user/:username" element={<UserProfilePage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/post" element={<PostEditorPage />} />
            <Route path="/postEdit/:id" element={<PostEditorPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/post/:postId/comment" element={<CommentEditorPage />} />
            <Route path="/post/:postId/comment/:commentId" element={<CommentEditorPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default AppRoutes;
