export default function VideoAd({ onComplete }) {
  const handleComplete = () => {
    alert("You earned $0.05!");
    onComplete();
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <video
        width="480"
        height="270"
        controls
        onEnded={handleComplete}
        style={{ borderRadius: "12px", boxShadow: "0 0 25px rgba(0,0,0,0.3)" }}
      >
        <source src="/sample-ad.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        Watch the full ad to earn money! Each ad adds directly to your GiftFX balance.
      </p>
    </div>
  );
}
