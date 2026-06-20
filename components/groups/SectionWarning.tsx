"use client";

export function SectionWarning({ message }: { message: string }) {
  return (
    <div
      className="mb-5 rounded-2xl border px-4 py-3 text-sm"
      style={{
        background: "#FFF8E7",
        borderColor: "#F3D08A",
        color: "#7A4A00",
      }}
    >
      {message}
    </div>
  );
}
