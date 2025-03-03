import { Metadata } from "next";

const description =
  "About the authors of Z Squared, Zaryab Ahmed and Zaid Marfatia.";

export const metadata: Metadata = {
  title: "About",
  description,
  openGraph: {
    title: "About",
    description,
    type: "website",
    siteName: "zsquared.ca",
    images: [
      `/api/og?title=About&description=${encodeURIComponent(description)}`,
    ],
  },
};

export default function About() {
  return <div>About page. Coming soon...</div>;
}
