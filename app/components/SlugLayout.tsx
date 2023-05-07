import { Link } from "@remix-run/react";
import { CalendarDays, FileCheck2, FolderTree, Instagram } from "lucide-react";
import type { AccountModel } from "~/lib/models";
import PageHeader from "./PageHeader";

export default function SlugLayout({
  account,
  date,
  children,
}: {
  children: React.ReactNode;
  account: AccountModel;
  date: string | null;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-4">
          <PageHeader link={`/dashboard/${account.slug}`}>
            {account.name}
          </PageHeader>

          <Link
            className="hover:text-brand"
            to={`https://instagram.com/${account.slug}`}
            target="_blank"
          >
            <Instagram className="h-8 w-8" />
          </Link>
        </div>

        <div className="shrink-0 text-sm font-semibold">
          <Link
            className="button button-link button-icon button-small"
            to={`./${date ? "?date=" + date : ""}`}
          >
            <CalendarDays />
            <div className="hidden md:block">Calendário</div>
          </Link>
          <Link
            className="button button-link button-icon button-small"
            to={`./actions`}
          >
            <FileCheck2 />
            <div className="hidden md:block">Ações</div>
          </Link>
          <Link
            className="button button-link button-icon button-small"
            to={`./campaigns`}
          >
            <FolderTree />
            <div className="hidden md:block">Campanhas</div>
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
