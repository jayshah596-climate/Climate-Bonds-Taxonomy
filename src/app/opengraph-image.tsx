import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #062b21 0%, #04140f 55%, #021b1f 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #10b981, #047857)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 21c8-1 13-6 14-15C10 7 6 12 5 21Z" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, opacity: 0.85 }}>Climate Bonds Taxonomy Explorer</span>
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, marginTop: 48, lineHeight: 1.1 }}>
          Every pathway. Every criteria.
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
          <span style={{ background: "linear-gradient(90deg,#34d399,#22d3ee)", backgroundClip: "text", color: "transparent" }}>
            One interactive platform.
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
          {["Mitigation", "Resilience", "Blue", "Methane"].map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                fontSize: 22,
                background: ["#10b981", "#3b82f6", "#22d3ee", "#fb923c"][i] + "26",
                color: ["#34d399", "#60a5fa", "#67e8f9", "#fdba74"][i],
                border: `1px solid ${["#10b981", "#3b82f6", "#22d3ee", "#fb923c"][i]}55`,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
