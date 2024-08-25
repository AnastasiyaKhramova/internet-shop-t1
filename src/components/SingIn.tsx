import { useState } from "react";
import Button from "./Button"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SingIn: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <section className="second-container registration">
        <h1 className="registration__title">Sign in</h1>
        <form className="registration__form" onSubmit={handleSignIn}>
          <input className="catalog__find"
            type="text"
            placeholder="Login"
            aria-label="Input Login"
            onChange={(e) => setUsername(e.target.value)}
            required />
          <input className="catalog__find"
            type="text"
            placeholder="Password"
            aria-label="Input Password"
            onChange={(e) => setPassword(e.target.value)}
            required />
          {error && <div className="error-message">{error}</div>}
          <Button
            btnName="Sign in"
            aria-lable="Sign in"
            type="submit"
          />
        </form>

      </section>
    </div>
  )
}

export default SingIn
