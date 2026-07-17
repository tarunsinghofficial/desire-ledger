"use client";

/** Gemini-style four-point spark — brand mark for AI features */
export function AiSpark({
  className = "",
  size = 40,
  active = true,
}: {
  className?: string;
  size?: number;
  active?: boolean;
}) {
  const fill = active ? "#9fe870" : "rgba(255,255,255,0.35)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M32 4C33.2 18.5 45.5 30.8 60 32C45.5 33.2 33.2 45.5 32 60C30.8 45.5 18.5 33.2 4 32C18.5 30.8 30.8 18.5 32 4Z"
        fill={fill}
      />
      <path
        d="M50 10C50.45 14.2 53.8 17.55 58 18C53.8 18.45 50.45 21.8 50 26C49.55 21.8 46.2 18.45 42 18C46.2 17.55 49.55 14.2 50 10Z"
        fill={fill}
        opacity={active ? 0.85 : 0.45}
      />
    </svg>
  );
}
