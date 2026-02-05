import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import "./login.css";
import logo from "./assets/logo1.png"; // adjust path if needed
import bgVideo from "./assets/login-video.mp4"; // looping video

function Login({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Call backend to get role
  const checkRoleFromBackend = async () => {
    const token = await auth.currentUser.getIdToken();

      localStorage.setItem("token", token);

    const res = await fetch("http://localhost:5000/api/auth/role", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data.role;
  };

  // 🔹 Redirect based on role
  const redirectUser = async (role) => {
  const token = await auth.currentUser.getIdToken();

  if (role === "reception") {
    window.location.href = `http://localhost:5175/?token=${token}`;
  } else {
    window.location.href = `http://localhost:5174/?token=${token}`;
  }
};

  // 🔹 Email + Password login (Reception)
  const handleEmailLogin = async () => {
    try {
      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      const role = await checkRoleFromBackend();
      redirectUser(role);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google login (Patient)
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);

      const role = await checkRoleFromBackend();
      redirectUser(role);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT PANEL */}
      <div className="login-left">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <img src={logo} alt="Zenith-Care" className="login-logo" />

        <p className="login-subtext">
          Smarter queues. Better care.
          <br />
          Secure access for hospitals and patients.
        </p>

        <div className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="primary-btn"
            onClick={handleEmailLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="divider">or</div>

          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Sign in with Google
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">

        <video
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          className="login-video"
        />
        <div className="video-overlay" />
      </div>
    </div>
  );
}

export default Login;
