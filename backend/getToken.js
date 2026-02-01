const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyDSyJ6jhkBgg8MD8CJ66w-EcOp2JxACfEk",
  authDomain: "zenith-care-4a96a.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getToken() {
  const user = await signInWithEmailAndPassword(
    auth,
    "sunshine@gmail.com",
    "qwertyuiop"
  );

  const token = await user.user.getIdToken();
  console.log(token);
}

getToken();


















