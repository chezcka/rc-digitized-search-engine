import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import logo from "../assets/rc-logo.png";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const normalizedUsername = form.username.trim().toLowerCase();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await set(ref(database, `users/${userCredential.user.uid}`), {
        fullName: form.fullName,
        username: normalizedUsername,
        email: form.email,
        createdAt: new Date().toISOString()
      });

      navigate("/login");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <img src={logo} alt="RC Logo" className="auth-logo" />

        <h2 className="auth-title">CREATE ACCOUNT</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />

            <span
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit">Register</button>

        </form>

        <p className="link" onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}