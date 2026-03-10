import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get, child } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import logo from "../assets/rc-logo.png";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "users"));

      if (!snapshot.exists()) {
        setError("User not found");
        return;
      }

      let emailFound = null;

      for (const childSnapshot of Object.values(snapshot.val())) {
        if (childSnapshot.username === username.trim().toLowerCase()) {
          emailFound = childSnapshot.email;
          break;
        }
      }

      if (!emailFound) {
        setError("Invalid username or password");
        return;
      }

      await signInWithEmailAndPassword(auth, emailFound, password);

      navigate("/search");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <img src={logo} alt="RC Logo" className="auth-logo" />

        <h2 className="auth-title">RCGate</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit">Login</button>

        </form>

        <p className="link" onClick={() => navigate("/register")}>
          Create an account
        </p>
      </div>
    </div>
  );
}