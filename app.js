// Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyDYlCL-LPbmomBnYayMVorT1V77XZS_aU8",
  authDomain: "gift-fx.firebaseapp.com",
  projectId: "gift-fx",
  storageBucket: "gift-fx.firebasestorage.app",
  messagingSenderId: "458627942036",
  appId: "1:458627942036:web:49823cc25cc29ffdb79681",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

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
signupBtn.addEventListener('click', () => {
  auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
    .then(cred => setupUserDoc(cred.user))
    .catch(err => alert(err.message));
});

// Login
loginBtn.addEventListener('click', () => {
  auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
    .catch(err => alert(err.message));
});

// Logout
logoutBtn?.addEventListener('click', () => auth.signOut());

// Setup new user doc
function setupUserDoc(user) {
  db.collection('users').doc(user.uid).set({
    balance: 0,
    adsWatched: 0,
    referralBonus: 0,
    activity: []
  }).then(() => console.log('User doc created'));
}

// Auth state change
auth.onAuthStateChanged(user => {
  if(user){
    currentUser=user;
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    userEmailEl.textContent=user.email;
    referralLinkInput.value=`${window.location.origin}?ref=${user.uid}`;
    loadUserData();
  }else{
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
  }
});

// Copy referral
copyReferralBtn.addEventListener('click', () => {
  referralLinkInput.select();
  referralLinkInput.setSelectionRange(0,99999);
  document.execCommand('copy');
  alert('Referral link copied!');
});

// Load user data
function loadUserData(){
  db.collection('users').doc(currentUser.uid).get().then(doc=>{
    if(doc.exists){
      const data=doc.data();
      balanceEl.textContent=`$${data.balance.toFixed(2)}`;
      adsWatchedEl.textContent=data.adsWatched;
      referralBonusEl.textContent=`$${data.referralBonus.toFixed(2)}`;
      dailyChallengeEl.textContent=`Watch 5 ads today for $0.25 bonus!`;
      updateActivityTable(data.activity);
    }
  });
}

// Update activity table
function updateActivityTable(activity){
  activityBody.innerHTML='';
  if(!activity.length){
    activityBody.innerHTML='<tr><td colspan="2">No activity yet. Start watching ads!</td></tr>';
    return;
  }
  activity.forEach(item=>{
    const row=`<tr><td>${item.time}</td><td>${item.earned.toFixed(2)}</td></tr>`;
    activityBody.innerHTML+=row;
  });
}

// Handle ad complete
adVideo?.addEventListener('ended',()=>{
  const earned=0.05;
  const now=new Date().toLocaleString();
  const userRef=db.collection('users').doc(currentUser.uid);
  userRef.update({
    balance:firebase.firestore.FieldValue.increment(earned),
    adsWatched:firebase.firestore.FieldValue.increment(1),
    activity:firebase.firestore.FieldValue.arrayUnion({time:now,earned})
  }).then(loadUserData());
});

// Simulate watch ad button
document.getElementById('watch-ad-btn')?.addEventListener('click',()=>{
  adVideo.dispatchEvent(new Event('ended'));
});
