import Image from "next/image"

export function RiselyLogo({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "dark"
  className?: string
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/risely-icon.png"
        alt="Risely logo"
        width={32}
        height={32}
        className="h-8 w-8 rounded-lg object-contain"
        priority
      />
      <span
        className={`text-lg font-bold tracking-tight ${
          variant === "light" ? "text-white" : "text-foreground"
        }`}
      >
        Risely
      </span>
    </div>
  )
}
