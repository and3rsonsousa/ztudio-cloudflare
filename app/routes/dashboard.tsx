import type { LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Outlet, useOutletContext } from "@remix-run/react";
import Layout from "~/components/Layout";
import { getUser } from "~/lib/auth.server";
import {
  getAccounts,
  getCategoriesStagesAttributes,
  getCelebrations,
  getPersonByUser,
  getPersons,
} from "~/lib/data";

export const loader: LoaderFunction = async ({ request, context }) => {
  const response = new Response();

  const {
    data: { session },
  } = await getUser(request, context);

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
  };
};

export default function Dashboard() {
  const context = useOutletContext();

  return (
    <Layout>
      <Outlet context={context} />
    </Layout>
  );
}
