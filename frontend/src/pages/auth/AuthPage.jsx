import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/Homepage.css";
import Navbar from "../../components/Navbar.jsx";
import AuthForm from "./AuthForm.jsx";

import { auth } from "./authApi.js";
import { validateAuthInput } from "./validateAuthInput.js";
import { useAuth } from "../../context/AuthContext.jsx";

function AuthPage() {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateAuthInput(username, password, isLogin);
    if (!validation.ok) {
      setErrorMessage(validation.message);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const result = await auth(username, password, isLogin);

    if (result.ok) {
      if (isLogin) {
        setSuccessMessage("Login successful: " + result.data.username);
        await refreshAuth();

        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setSuccessMessage("Registration successful! Logging you in...");

        setTimeout(async () => {
          const loginResult = await auth(username, password, true);

          if (loginResult.ok) {
            await refreshAuth();
            navigate("/");
          } else {
            setIsLogin(true);
            setErrorMessage("Please log in with your new account.");
          }
          setIsSubmitting(false);
        }, 800);
        return;
      }
    } else {
      setErrorMessage("Error: " + result.data.message);
    }

    setIsSubmitting(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <>
      <Navbar />

      <AuthForm
        isLogin={isLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        toggleMode={toggleMode}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
    </>
  );
}

export default AuthPage;
