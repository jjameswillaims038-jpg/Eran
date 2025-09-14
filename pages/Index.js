import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Footer from "../components/Footer";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const signin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <header style={{ backgroundColor: "#ff6600", color: "#fff", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "50px", marginBottom: "10px" }}>GiftFX 🌟</h1>
        <p style={{ fontSize: "20px", maxWidth: "800px", margin: "0 auto" }}>
          GiftFX is your ultimate platform to earn money online by watching ads! Turn your free time into cash. Watch ads, complete tasks, and grow your balance instantly. It's safe, fast, and user-friendly!
        </p>
      </header>

      <section style={{ padding: "50px", textAlign: "center" }}>
        <h2 style={{ fontSize: "36px" }}>Get Started Today</h2>
        <p>Create your account and join thousands of users earning online!</p>
        <div style={{ margin: "20px 0" }}>
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ margin: "5px", padding: "12px", width: "250px", borderRadius: "8px" }}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ margin: "5px", padding: "12px", width: "250px", borderRadius: "8px" }}
          />
        </div>
        <div>
          <button onClick={signup} style={{ marginRight: "10px", padding: "12px 25px", borderRadius: "8px", backgroundColor: "#28a745", color: "#fff", fontWeight: "bold" }}>Sign Up</button>
          <button onClick={signin} style={{ padding: "12px 25px", borderRadius: "8px", backgroundColor: "#007bff", color: "#fff", fontWeight: "bold" }}>Sign In</button>
        </div>
      </section>

      <section style={{ backgroundColor: "#f5f5f5", padding: "50px", textAlign: "center" }}>
        <h2>How GiftFX Works</h2>
        <p style={{ maxWidth: "700px", margin: "0 auto" }}>
          1️⃣ Sign up and login.<br/>
          2️⃣ Watch full ads to earn money directly in your account.<br/>
          3️⃣ Monitor your balance in the dashboard.<br/>
          4️⃣ Withdraw earnings anytime safely.<br/>
          5️⃣ Refer friends for extra bonuses and increase your income.<br/>
          6️⃣ Enjoy daily challenges and promotions for more rewards.
        </p>
      </section>

      <section style={{ padding: "50px", textAlign: "center", background: "linear-gradient(to right, #ff9966, #ff5e62)", color: "#fff" }}>
        <h2>Why Choose GiftFX?</h2>
        <p style={{ maxWidth: "700px", margin: "0 auto" }}>
          ✅ Easy to use and beginner-friendly.<br/>
          ✅ Real-time balance updates.<br/>
          ✅ Safe, secure, and transparent.<br/>
          ✅ Multiple ads available to maximize earnings.<br/>
          ✅ Motivational dashboard with activity history.<br/>
          ✅ Friendly 24/7 support and quick withdrawals.
        </p>
      </section>

      <Footer />
    </div>
  );
}
