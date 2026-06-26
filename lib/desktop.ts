export function isDesktop() {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent.toLowerCase();

  return (
    ua.includes("tauri") ||
    ua.includes("pake") ||
    ua.includes("evven")
  );
}