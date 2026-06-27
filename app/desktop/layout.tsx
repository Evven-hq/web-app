import Script from "next/script";

export const metadata = {
  title: "Evven",
};

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script id="evven-desktop-runtime" strategy="beforeInteractive">
        {`
          try {
            window.sessionStorage.setItem("evven-runtime-mode", "desktop");
          } catch (error) {
            // Ignore storage failures and fall back
          }
        `}
      </Script>
      {children}
    </>
  );
}
