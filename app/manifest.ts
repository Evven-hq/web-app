import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Evven",
    short_name: "Evven",
    description:
      "Keep shared costs fair, clear, and totally handled. Evven makes group expense tracking simple and automated.",
    start_url: "/",
    display: "standalone",
    background_color: "#2c2924",
    theme_color: "#2c2924",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
