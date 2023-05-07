export default function Loader({
  size,
}: {
  size?: "small" | "normal" | "large";
}) {
  return (
    // <ArrowPathIcon
    //   className={`${
    //     size ? (size === "small" ? "w-6" : "w-8") : "w-4"
    //   } animate-spin`}
    // />
    <div
      className={`${
        size
          ? size === "small"
            ? "h-4 w-4 border-2"
            : "border-6 h-8 w-8"
          : "h-6 w-6 border-4"
      }  animate-spin rounded-full  border-brand border-t-brand-300 dark:border-t-brand-900`}
    ></div>
  );
}
