import type {
  LinksFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { createServerClient } from "./lib/supabase";
import { useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import dayjs from "dayjs";
import { type ContextType } from "./lib/models";

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "ᴢᴛᴜᴅɪᴏ - ᴘʟaɴ ꜰazᴛ, ᴡᴏʀᴋ ʟezz",
    },
    {
      name: "description",
      content:
        "sistema de gerenciamento de ações criado e mantido pela aɢêɴᴄɪa caɴɪveᴛe",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "icon",
    href: "/ico.png",
  },
];

export const loader: LoaderFunction = async ({ request, context }) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context;
  const response = new Response();
  const supabase = createServerClient({
    SUPABASE_URL: SUPABASE_URL as string,
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY as string,
    request,
    response,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    env: {
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    },
    session,
    headers: response.headers,
  };
};

export default function App() {
  const { env } = useLoaderData();

  const [supabase] = useState(() => {
    return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  });

  const [day, setDay] = useState(dayjs());
  const [filter, setFilter] = useState("all");
  const [arrange, setArrange] = useState("arrange_all");
  const [priority, setPriority] = useState(true);
  const [openDialogAction, setDialogAction] = useState(true);
  const [openDialogCelebration, setDialogCelebration] = useState(false);
  const [openDialogCampaign, setDialogCampaign] = useState(false);
  const [openDialogSearch, setDialogSearch] = useState(false);
  const [openShortcut, setShortcut] = useState(false);
  const [sidebar, setSidebar] = useState(true);

  const context: ContextType = {
    date: {
      day,
      set: setDay,
    },
    filter: {
      option: filter,
      set: setFilter,
    },
    arrange: {
      option: arrange,
      set: setArrange,
    },
    priority: {
      option: priority,
      set: setPriority,
    },
    actions: {
      open: openDialogAction,
      set: setDialogAction,
    },
    celebrations: {
      open: openDialogCelebration,
      set: setDialogCelebration,
    },
    campaigns: {
      open: openDialogCampaign,
      set: setDialogCampaign,
    },
    search: {
      open: openDialogSearch,
      set: setDialogSearch,
    },

    shortcut: {
      open: openShortcut,
      set: setShortcut,
    },
    sidebar: {
      open: sidebar,
      set: setSidebar,
    },
    supabase,
  };

  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet {...{ context }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <html lang="pt-br">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <div className="grid min-h-screen place-content-center">
            <div className="max-w-lg">
              <h1 className="mb-0 text-error-600">Error</h1>
              <p className="mb-8 text-2xl font-light">{error.message}</p>
              <pre className="whitespace-pre-wrap">{error.stack}</pre>
            </div>
          </div>
        </body>
      </html>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
