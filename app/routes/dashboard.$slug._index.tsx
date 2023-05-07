import type {
  ActionFunction,
  LoaderArgs,
  LoaderFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Views/Calendar";
import { getActions, getCampaigns, handleAction } from "~/lib/data";
import { checkDate } from "~/lib/functions";

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderArgs) => {
  const period = checkDate(
    new URL(request.url).searchParams.get("date") as string,
    `/dashboard/${params.slug}/`
  );

  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      account: params.slug,
      period,
    }),
    getCampaigns({ request, account: params.slug }),
  ]);
  return { actions, campaigns, date: period };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return handleAction(formData, request);
};

export default function SlugIndex() {
  const { actions, campaigns, date } = useLoaderData();

  return (
    <>
      <Calendar
        actions={actions}
        campaigns={campaigns}
        grid={true}
        date={date}
      />
    </>
  );
}
