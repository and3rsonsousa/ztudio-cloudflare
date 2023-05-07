import { Link } from "@remix-run/react";

export default function PageHeader({
  children,
  link,
}: {
  children: React.ReactNode;
  link?: string;
}) {
  return link ? (
    <Link
      to={link}
      className="overflow-hidden text-ellipsis whitespace-nowrap  rounded text-2xl font-bold tracking-tight outline-none focus:ring focus:ring-brand dark:text-gray-200 lg:text-3xl"
    >
      {children}
    </Link>
  ) : (
    <h2 className="mb-0 overflow-hidden text-ellipsis whitespace-nowrap  outline-none focus:ring-2 focus:ring-brand dark:text-gray-200">
      {children}
    </h2>
  );
}
