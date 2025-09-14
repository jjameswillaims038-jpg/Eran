// Firebase modular imports
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAB99WMwmL3THMSWiU9evMVDA-0kk-NSyw",
  authDomain: "giftfxproject.firebaseapp.com",
  projectId: "giftfxproject",
  storageBucket: "giftfxproject.firebasestorage.app",
  messagingSenderId: "697529582028",
  appId: "1:697529582028:web:602fff8bb00ffafb73dd69",
  measurementId: "G-70V02M5J2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailEl = document.getElementById('user-email');
const balanceEl = document.getElementById('balance');
const adsWatchedEl = document.getElementById('ads-watched');
const activityBody = document.getElementById('activity-body');
const adVideo = document.getElementById('ad-video');
const referralLinkInput = document.getElementById('referral-link');
const copyReferralBtn = document.getElementById('copy-referral');
const referralBonusEl = document.getElementById('referral-bonus');
const dailyChallengeEl = document.getElementById('daily-challenge');

let currentUser = null;
let referralBonus = 0;

// Sign Up
signupBtn.addEventListener('click', async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    const user = userCredential.user;

    // Create Firestore document
    await setDoc(doc(db, "users", user.uid), {
      balance: 0,
      adsWatched: 0,
      adsWatchedToday: 0,
      referralBonus: 0,
      activity: []
    });
    alert("Sign up successful! You can now login.");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

// Login
loginBtn.addEventListener('click', async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert("Login successful!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  alert("Logged out");
});

// Copy referral
copyReferralBtn.addEventListener('click', () => {
  referralLinkInput.select();
  referralLinkInput.setSelectionRange(0, 99999);
  document.execCommand('copy');
  alert('Referral link copied!');
});

// Auth state change
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    userEmailEl.textContent = user.email;
    referralLinkInput.value = `${window.location.origin}?ref=${user.uid}`;

    // Load user data
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      balanceEl.textContent = `$${data.balance.toFixed(2)}`;
      adsWatchedEl.textContent = data.adsWatched;
      referralBonus = data.referralBonus || 0;
      referralBonusEl.textContent = `$${referralBonus.toFixed(2)}`;

      // Daily challenge: Watch 5 ads
      const remaining = Math.max(5 - data.adsWatchedToday, 0);
      dailyChallengeEl.textContent = remaining > 0 ?
        `Watch ${remaining} more ads today to earn bonus $0.25!` :
        `Daily challenge completed! 🎉`;

      // Update activity table
      activityBody.innerHTML = '';
      if (!data.activity.length) {
        activityBody.innerHTML = '<tr><td colspan="2">No activity yet. Start watching ads!</td></tr>';
      } else {
        data.activity.forEach(item => {
          const row = `<tr><td>${item.time}</td><td>$${item.earned.toFixed(2)}</td></tr>`;
          activityBody.innerHTML += row;
        });
      }
    }
  } else {
    currentUser = null;
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
  }
});

// Handle ad complete
adVideo.addEventListener('ended', async () => {
  if (!currentUser) return;
  const earned = 0.05;
  const now = new Date().toLocaleString();
  const userRef = doc(db, "users", currentUser.uid);

  await updateDoc(userRef, {
    balance: increment(earned),
    adsWatched: increment(1),
    adsWatchedToday: increment(1),
    activity: arrayUnion({ time: now, earned })
  });

  // Reload dashboard data
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    balanceEl.textContent = `$${data.balance.toFixed(2)}`;
    adsWatchedEl.textContent = data.adsWatched;

    const remaining = Math.max(5 - data.adsWatchedToday, 0);
    dailyChallengeEl.textContent = remaining > 0 ?
      `Watch ${remaining} more ads today to earn bonus $0.25!` :
      `Daily challenge completed! 🎉`;

    // Update activity table
    activityBody.innerHTML = '';
    data.activity.forEach(item => {
      const row = `<tr><td>${item.time}</td><td>$${item.earned.toFixed(2)}</td></tr>`;
      activityBody.innerHTML += row;
    });
  }
});
