import { ImageResponse } from "next/og";

async function loadGoogleFont(font: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Z Squared";
  const description =
    searchParams.get("description") ||
    "Creed, corporations, culture, and everything in between";
  return new ImageResponse(
    (
      <div
        style={{
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "DM Serif Text",
              fontSize: 50,
              fontWeight: "bold",
              marginBottom: 16,
              color: "#218c74",
            }}>
            {title}
          </div>
          <div
            style={{
              fontFamily: "DM Sans",
              fontSize: 24,
              color: "#525252",
            }}>
            {description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              process.env.NODE_ENV === "development"
                ? `http://localhost:${process.env.PORT}/logo-brand.png`
                : "https://zsquared.ca/logo-brand.png"
            }
            alt="Logo for zsquared.ca"
            width={100}
            height={100}
            style={{ marginRight: 24 }}
          />
          <div style={{ fontFamily: "DM Sans", fontSize: 24 }}>
            zsquared.ca
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "DM Sans",
          data: await loadGoogleFont("DM+Sans"),
          style: "normal",
        },
        {
          name: "DM Serif Text",
          data: await loadGoogleFont("DM+Serif+Text"),
          style: "normal",
        },
      ],
    },
  );
}
