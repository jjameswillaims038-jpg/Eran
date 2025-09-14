// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDYlCL-LPbmomBnYayMVorT1V77XZS_aU8",
  authDomain: "gift-fx.firebaseapp.com",
  projectId: "gift-fx",
  storageBucket: "gift-fx.firebasestorage.app",
  messagingSenderId: "458627942036",
  appId: "1:458627942036:web:49823cc25cc29ffdb79681",
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

// Sign Up
signupBtn.addEventListener('click', async () => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    await setupUserDoc(cred.user.uid);
  } catch (err) {
    alert(err.message);
  }
});

// Login
loginBtn.addEventListener('click', async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
  } catch (err) {
    alert(err.message);
  }
});

// Logout
logoutBtn.addEventListener('click', () => signOut(auth));

// Setup new user doc
async function setupUserDoc(uid) {
  await setDoc(doc(db, "users", uid), {
    balance: 0,
    adsWatched: 0,
    adsWatchedToday: 0,
    referralBonus: 0,
    activity: []
  });
  console.log('User doc created');
}

// Auth state change
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    userEmailEl.textContent = user.email;
    referralLinkInput.value = `${window.location.origin}?ref=${user.uid}`;
    loadUserData();
  } else {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
  }
});

// Copy referral
copyReferralBtn.addEventListener('click', () => {
  referralLinkInput.select();
  referralLinkInput.setSelectionRange(0, 99999);
  document.execCommand('copy');
  alert('Referral link copied!');
});

// Load user data
async function loadUserData() {
  const docRef = doc(db, "users", currentUser.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    balanceEl.textContent = `$${data.balance.toFixed(2)}`;
    adsWatchedEl.textContent = data.adsWatched;
    referralBonusEl.textContent = `$${data.referralBonus.toFixed(2)}`;
    const remaining = Math.max(5 - (data.adsWatchedToday || 0), 0);
    dailyChallengeEl.textContent = remaining > 0 ?
      `Watch ${remaining} more ads today to earn bonus $0.25!` :
      `Daily challenge completed! 🎉`;
    updateActivityTable(data.activity || []);
  }
}

// Update activity table
function updateActivityTable(activity) {
  activityBody.innerHTML = '';
  if (!activity.length) {
    activityBody.innerHTML = '<tr><td colspan="2">No activity yet. Start watching ads!</td></tr>';
    return;
  }
  activity.forEach(item => {
    const row = `<tr><td>${item.time}</td><td>${item.earned.toFixed(2)}</td></tr>`;
    activityBody.innerHTML += row;
  });
}

// Handle ad complete
adVideo.addEventListener('ended', async () => {
  const earned = 0.05;
  const now = new Date().toLocaleString();
  const userRef = doc(db, "users", currentUser.uid);
  await updateDoc(userRef, {
    balance: increment(earned),
    adsWatched: increment(1),
    adsWatchedToday: increment(1),
    activity: arrayUnion({ time: now, earned })
  });
  loadUserData();
});
