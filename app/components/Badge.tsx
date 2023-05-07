export default function Badge({
  children,
  size = "medium",
  className,
}: {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  className?: string;
}) {
  return (
    <div
      className={`absolute -top-2 -right-2 grid place-items-center rounded-full bg-gray-600  text-white ${
        size === "small"
          ? "px-1 text-xx"
          : size === "large"
          ? "px-2.5 py-1 text-sm"
          : "px-1.5 py-0.5 text-xs"
      } ${className}`}
    >
      {children}
    </div>
  );
}
