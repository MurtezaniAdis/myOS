function AuthForm({
  isLogin,
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  toggleMode,
  isSubmitting,
  errorMessage,
  successMessage,
}) {
  let title = "";
  let description = "";
  let submitLabel = "";
  let switchLabel = "";

  if (isLogin) {
    title = "Log in";
    description = "If you already have an account, you need just to log in.";
    submitLabel = "Log in";
    switchLabel = "Create an account, if you don't have already.";
  } else {
    title = "Register";
    description = "If you don't have an account, you can create one.";
    submitLabel = "Register";
    switchLabel = "Have an Account already?";
  }

  return (
    <div
      className="row w-100 justify-content-center"
      style={{ marginTop: "11rem" }}
    >
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4 p-4">
          <h3 className="fw-bold mb-2">{title}</h3>
          <p className="text-muted mb-4">{description}</p>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={15}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={20}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              style={{ background: "#004e72", color: "#FEFEFE" }}
              disabled={isSubmitting}
            >
              {submitLabel}
            </button>
          </form>

          <div className="text-center">
            <button className="btn btn-link p-0" onClick={toggleMode}>
              {switchLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
