import { useState } from "react";
import { login } from "../store/auth/actions";
import { useUserAuth } from "../store/auth/provider";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useUserAuth();

  async function handleLogin(e) {
    e.preventDefault();
    login(dispatch, { email, password });
  }

  return (
    <form
      className="flex flex-col items-center justify-center space-y-3 min-h-screen"
      onSubmit={handleLogin}
    >
      <div className="flex flex-row items-center p-3 space-x-3">
        <label>Email</label>
        <input
          type="email"
          placeholder="Your email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-center p-3 space-x-3">
        <label>Password</label>
        <input
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="p-3 rounded-lg bg-slate-600 text-white">
        Login
      </button>
    </form>
  );
}
