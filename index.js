<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GiftFX - Earn Money Watching Ads</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore-compat.js"></script>
</head>
<body>
  <header>
    <h1>GiftFX 🌟</h1>
    <p>Turn your free time into cash! Watch ads, complete tasks, and earn instantly.</p>
  </header>

  <section id="auth-section">
    <h2>Create Account / Login</h2>
    <input type="email" id="email" placeholder="Email">
    <input type="password" id="password" placeholder="Password">
    <div>
      <button id="signup-btn">Sign Up</button>
      <button id="login-btn">Login</button>
    </div>
  </section>

  <section id="dashboard-section" class="hidden">
    <h2>Welcome, <span id="user-email"></span> 🌟</h2>

    <div class="stats">
      <div class="card gradient-card" id="balance-card">
        <h3>Balance</h3>
        <p id="balance">$0.00</p>
        <p>Keep watching ads daily to grow your earnings.</p>
      </div>

      <div class="card gradient-card" id="ads-card">
        <h3>Ads Watched</h3>
        <p id="ads-watched">0</p>
        <p>Each ad increases your balance. Stay focused!</p>
      </div>

      <div class="card gradient-card" id="referral-card">
        <h3>Referral Bonus</h3>
        <p id="referral-bonus">$0.00</p>
        <p>Invite friends and earn $0.10 per referral!</p>
        <input type="text" id="referral-link" readonly>
        <button id="copy-referral">Copy Link</button>
      </div>

      <div class="card gradient-card" id="challenge-card">
        <h3>Daily Challenge</h3>
        <p id="daily-challenge">Watch 5 ads today to earn a bonus $0.25!</p>
      </div>
    </div>

    <section id="tips-section">
      <h3>💡 Tips & Motivation</h3>
      <ul>
        <li>Watch all available ads daily to maximize your earnings.</li>
        <li>Invite friends and get bonus rewards!</li>
        <li>Check your dashboard often for surprises and daily challenges.</li>
        <li>Set daily goals and try to beat them every day!</li>
      </ul>
    </section>

    <div id="ad-section">
      <h3>Watch Ads & Earn</h3>
      <video id="ad-video" width="480" height="270" controls>
        <source src="sample-ad.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <p>Watch the full ad to earn $0.05! Every ad counts towards your total balance.</p>
    </div>

    <div id="activity-section">
      <h3>Recent Activity</h3>
      <table>
        <thead>
          <tr><th>Time</th><th>Earned ($)</th></tr>
        </thead>
        <tbody id="activity-body">
        </tbody>
      </table>
    </div>

    <button id="logout-btn">Logout</button>
  </section>

  <footer>
    <p>© 2025 GiftFX – Earn Money Watching Ads</p>
    <p>Contact: 2349164624021</p>
  </footer>

  <script src="app.js"></script>
</body>
</html>
