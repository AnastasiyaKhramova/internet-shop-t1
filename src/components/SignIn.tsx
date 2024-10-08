import { useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const login = authContext?.login;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login) {
      setError("Authentication is not available");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="second-container registration">
        <h1 className="registration__title">Sign in</h1>
        <form className="registration__form" onSubmit={handleSignIn}>
          <input
            className="catalog__find registration__input"
            type="text"
            placeholder="Login"
            aria-label="Input Login"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="catalog__find registration__input"
            type="password"
            placeholder="Password"
            aria-label="Input Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Button btnName="Sign in" aria-label="Sign in" type="submit" />
          )}
        </form>
      </section>
    </div>
  );
};

export default SignIn;
