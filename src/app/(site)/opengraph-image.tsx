import { ImageResponse } from "next/og";

export const alt = "ServeNest: home services, done properly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori, which draws this image, cannot read the site's CSS, so the font is fetched here.
// If that fails the image still renders, in a plain font.
async function loadPoppins(weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Poppins:wght@${weight}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;

    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [regular, bold] = await Promise.all([loadPoppins(400), loadPoppins(700)]);

  const fonts = [
    ...(regular
      ? [{ name: "Poppins", data: regular, weight: 400 as const, style: "normal" as const }]
      : []),
    ...(bold ? [{ name: "Poppins", data: bold, weight: 700 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#064e3b",
          color: "#f8e7c9",
          padding: 72,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>ServeNest</div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Home services, done properly.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 34,
              color: "rgba(248, 231, 201, 0.75)",
            }}
          >
            Approved technicians, clear quotes, every job tracked.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            color: "rgba(248, 231, 201, 0.7)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 16,
              height: 16,
              borderRadius: 8,
              background: "#a8741a",
              marginRight: 14,
            }}
          />
          The mobile app is in development
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}