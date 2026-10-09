import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Zain Mushtaq - Full-Stack Developer & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0F",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          color: "white",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: "bold", color: "#C6F432", marginBottom: 20 }}>
          Zain Mushtaq
        </div>
        <div style={{ fontSize: 40, color: "#888", textAlign: "center", maxWidth: "800px" }}>
          Full-Stack Developer & AI Engineer
        </div>
      </div>
    ),
    { ...size }
  );
}
