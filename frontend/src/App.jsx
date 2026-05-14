import { useState } from "react";

function App() {
  const [amount, setAmount] = useState(1000);
  const [source, setSource] = useState("AED");
  const [target, setTarget] = useState("INR");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function compareRates() {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/compare?source=${source}&target=${target}&amount=${amount}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Frontend error:", error);
    }

    setLoading(false);
  }

  return (
    <div style={pageStyle}>
      <div style={topBar}>
        <div style={logoStyle}>RemitCompare</div>
        <div style={navText}>Live FX • UAE Remittance • Smart Comparison</div>
      </div>

      <main style={mainStyle}>
        <section style={heroStyle}>
          <p style={tagStyle}>FINTECH REMITTANCE COMPARATOR</p>

          <h1 style={titleStyle}>
            Find the best way to send money abroad.
          </h1>

          <p style={subtitleStyle}>
            Compare live Wise rates against selected UAE remittance providers and
            instantly see who gives the recipient the highest amount.
          </p>

          <div style={statsRow}>
            <div style={statCard}>
              <strong>Live API</strong>
              <span>Wise integration</span>
            </div>
            <div style={statCard}>
              <strong>Ranked</strong>
              <span>Best provider first</span>
            </div>
            <div style={statCard}>
              <strong>Instant</strong>
              <span>Real-time comparison</span>
            </div>
          </div>
        </section>

        <section style={panelStyle}>
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Compare Transfer</h2>

            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={inputStyle}
            />

            <div style={twoColumn}>
              <div>
                <label>From</label>
                <select value={source} onChange={(e) => setSource(e.target.value)} style={inputStyle}>
                  <option>AED</option>
                  <option>USD</option>
                  <option>QAR</option>
                </select>
              </div>

              <div>
                <label>To</label>
                <select value={target} onChange={(e) => setTarget(e.target.value)} style={inputStyle}>
                  <option>INR</option>
                  <option>PKR</option>
                  <option>PHP</option>
                </select>
              </div>
            </div>

            <button onClick={compareRates} style={buttonStyle}>
              {loading ? "Comparing..." : "Compare Rates"}
            </button>
          </div>

          {data && (
            <div style={resultBox}>
              <div style={bestHeader}>
                <span>Best Provider</span>
                <strong>{data.best_provider}</strong>
              </div>

              <div style={resultsGrid}>
                {data.results?.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      ...resultItem,
                      border: index === 0 ? "1px solid #38bdf8" : "1px solid rgba(148,163,184,0.18)"
                    }}
                  >
                    <div style={rankBadge}>#{index + 1}</div>
                    <h3>{item.provider}</h3>
                    <p>Rate: {item.rate}</p>
                    <p>
                      Recipient gets: <strong>{item.recipient_gets} {target}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  width: "100%",
  background: "radial-gradient(circle at top left, #1d4ed8 0%, #020617 38%, #020617 100%)",
  color: "white",
  fontFamily: "'Space Grotesk', Arial, sans-serif",
  boxSizing: "border-box"
};

const topBar = {
  height: "72px",
  padding: "0 56px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid rgba(148,163,184,0.16)"
};

const logoStyle = {
  fontSize: "22px",
  fontWeight: "800",
  letterSpacing: "-0.5px"
};

const navText = {
  color: "#94a3b8",
  fontSize: "14px"
};

const mainStyle = {
  minHeight: "calc(100vh - 72px)",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "40px",
  padding: "35px 72px",
  boxSizing: "border-box"
};

const heroStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
};

const tagStyle = {
  color: "#38bdf8",
  fontWeight: "800",
  letterSpacing: "2px",
  fontSize: "14px"
};

const titleStyle = {
  fontSize: "60px",
  lineHeight: "1",
  margin: "22px 0",
  letterSpacing: "-3px",
  maxWidth: "720px"
};

const subtitleStyle = {
  color: "#bfdbfe",
  fontSize: "20px",
  lineHeight: "1.7",
  maxWidth: "680px"
};

const statsRow = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
  marginTop: "36px",
  maxWidth: "680px"
};

const statCard = {
  background: "rgba(15,23,42,0.72)",
  border: "1px solid rgba(148,163,184,0.18)",
  borderRadius: "18px",
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  color: "#cbd5e1"
};

const panelStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "22px"
};

const cardStyle = {
  background: "rgba(15, 23, 42, 0.88)",
  border: "1px solid rgba(148, 163, 184, 0.24)",
  borderRadius: "28px",
  padding: "32px",
  boxShadow: "0 30px 90px rgba(0,0,0,0.45)"
};

const twoColumn = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px"
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  margin: "8px 0 20px",
  borderRadius: "14px",
  border: "1px solid rgba(148, 163, 184, 0.28)",
  background: "#020617",
  color: "white",
  fontSize: "16px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "17px",
  borderRadius: "16px",
  border: "none",
  background: "linear-gradient(135deg, #8b5cf6, #2563eb)",
  color: "white",
  fontSize: "17px",
  fontWeight: "800",
  cursor: "pointer"
};

const resultBox = {
  background: "rgba(2,6,23,0.86)",
  border: "1px solid rgba(148,163,184,0.2)",
  borderRadius: "28px",
  padding: "26px"
};

const bestHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  fontSize: "18px"
};

const resultsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px"
};

const resultItem = {
  position: "relative",
  background: "#0f172a",
  borderRadius: "20px",
  padding: "20px"
};

const rankBadge = {
  position: "absolute",
  top: "16px",
  right: "16px",
  color: "#38bdf8",
  fontWeight: "800"
};

export default App;