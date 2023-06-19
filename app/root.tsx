import type { LinksFunction, V2_MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import styles from "./tailwind.css";

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
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  { rel: "manifest", href: "/site.webmanifest" },
];

export default function App() {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
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
