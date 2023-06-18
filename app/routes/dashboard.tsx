import type { LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import dayjs from "dayjs";
import { useState } from "react";
import Layout from "~/components/Layout";
import {
  getAccounts,
  getCategoriesStagesAttributes,
  getCelebrations,
  getPersonByUser,
  getPersons,
} from "~/lib/data";
import type { PersonModel, ContextType } from "~/lib/models";
import { createServerClient } from "~/lib/supabase";

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

  if (!session) {
    throw redirect("/login", { headers: response.headers });
  }

  const userId = session.user.id;
  const [
    { data: person },
    { data: persons },
    { data: accounts },
    { categories, stages, attributes },
    { data: celebrations },
  ] = await Promise.all([
    getPersonByUser(userId, request, context),
    getPersons(request, context),
    getAccounts(userId, request, context),
    getCategoriesStagesAttributes(request, context),
    getCelebrations(request, context),
  ]);

  const url = new URL(request.url).pathname;

  return {
    person,
    persons,
    accounts,
    categories,
    stages,
    attributes,
    celebrations,
    url,
    user: session.user,
    env: {
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    },
    session,
    headers: response.headers,
  };
};

export default function Dashboard() {
  const { env, person } = useLoaderData();

  const [supabase] = useState(() => {
    return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  });

  const [day, setDay] = useState(dayjs());
  const [filter, setFilter] = useState("all");
  const [arrange, setArrange] = useState(
    (person as PersonModel).config_show ?? "arrange_all"
  );
  const [priority, setPriority] = useState(
    (person as PersonModel).config_order === "status"
  );
  const [openDialogAction, setDialogAction] = useState(false);
  const [openDialogCelebration, setDialogCelebration] = useState(false);
  const [openDialogCampaign, setDialogCampaign] = useState(false);
  const [openDialogSearch, setDialogSearch] = useState(false);
  const [openShortcut, setShortcut] = useState(false);
  const [sidebar, setSidebar] = useState(
    (person as PersonModel).config_sidebar === "true"
  );

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
    <Layout {...{ context }}>
      <Outlet {...{ context }} />
    </Layout>
  );
}
