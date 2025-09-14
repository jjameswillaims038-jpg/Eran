import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import VideoAd from "../components/VideoAd";
import Footer from "../components/Footer";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [adsWatched, setAdsWatched] = useState(0);
  const [activity, setActivity] = useState([]);
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged(async (u) => {
      if (!u) return router.push("/");
      setUser(u);
      const docRef = doc(db, "users", u.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, { balance: 0, adsWatched: 0, activity: [] });
      } else {
        const data = docSnap.data();
        setBalance(data.balance || 0);
        setAdsWatched(data.adsWatched || 0);
        setActivity(data.activity || []);
      }
    });
  }, []);

  const logout = () => signOut(auth).then(() => router.push("/"));

  const updateBalance = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const now = new Date().toLocaleString();

    await updateDoc(docRef, {
      balance: balance + 0.05,
      adsWatched: adsWatched + 1,
      activity: arrayUnion({ time: now, earned: 0.05 })
    });

    setBalance(prev => prev + 0.05);
    setAdsWatched(prev => prev + 1);
    setActivity(prev => [{ time: now, earned: 0.05 }, ...prev].slice(0, 5));
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", paddingBottom: "100px", background: "linear-gradient(to right, #00c6ff, #0072ff)" }}>
      <header style={{ padding: "30px", textAlign: "center", color: "#fff" }}>
        <h1 style={{ fontSize: "40px" }}>Welcome, {user?.email} 🌟</h1>
        <p>Your GiftFX Dashboard – Track your earnings, watch ads, and stay motivated!</p>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "20px" }}>
        <div style={{
          backgroundColor: "#fff",
          padding: "25px",
          margin: "10px",
          borderRadius: "12px",
          width: "250px",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          transition: "0.3s",
          cursor: "pointer"
        }}>
          <h2>Balance</h2>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "#28a745" }}>${balance.toFixed(2)}</p>
          <p>Keep watching ads to grow your earnings every day!</p>
        </div>

        <div style={{
          backgroundColor: "#fff",
          padding: "25px",
          margin: "10px",
          borderRadius: "12px",
          width: "250px",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          transition: "0.3s",
          cursor: "pointer"
        }}>
          <h2>Ads Watched</h2>
          <p style={{ fontSize: "28px", fontWeight: "bold", color: "#007bff" }}>{adsWatched}</p>
          <p>Each ad you watch adds to your balance instantly. Keep going!</p>
        </div>
      </div>

      <div style={{ textAlign: "center", margin: "30px", color: "#fff" }}>
        <h2 style={{ fontSize: "28px" }}>Watch Ads & Earn</h2>
        <VideoAd onComplete={updateBalance} />
        <button onClick={logout} style={{ marginTop: "25px", padding: "12px 25px", borderRadius: "8px", backgroundColor: "#ff3e6c", color: "#fff", fontWeight: "bold" }}>Logout</button>
      </div>

      <div style={{ maxWidth: "700px", margin: "40px auto", backgroundColor: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 0 20px rgba(0,0,0,0.3)" }}>
        <h3>Recent Activity</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "16px" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "2px solid #ccc", padding: "10px" }}>Time</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "10px" }}>Earned ($)</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((item, index) => (
              <tr key={index}>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{item.time}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{item.earned.toFixed(2)}</td>
              </tr>
            ))}
            {activity.length === 0 && (
              <tr>
                <td colSpan="2" style={{ textAlign: "center", padding: "10px" }}>No activity yet. Start watching ads now!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}
