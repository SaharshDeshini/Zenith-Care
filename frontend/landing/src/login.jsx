import { auth, googleProvider } from "./firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

function Login() {
  const handleEmailLogin = async () => {
    try {
      const email = "apollo@hospitals.in"; // TEMP
      const password = "qwertyuiop";            // TEMP

      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Logged in user:", result.user);
      await checkRoleFromBackend();
    } catch (err) {
      console.error("Email login error:", err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google user:", result.user);
      await checkRoleFromBackend();

    } catch (err) {
      console.error("Google login error:", err.message);
    }
  };

  const checkRoleFromBackend = async () => {
  const token = await auth.currentUser.getIdToken();

  const res = await fetch("http://localhost:5000/api/auth/role", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log("ROLE FROM BACKEND:", data);
};


  return (
    <div>
      <h2>Login</h2>

      <button onClick={handleEmailLogin}>
        Login with Email
      </button>

      <button onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
}

export default Login;
