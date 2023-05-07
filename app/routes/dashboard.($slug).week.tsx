import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import CalendarHeader from "~/components/Views/CalendarHeader";
import DataFlow from "~/components/DataFlow";
import WeekView from "~/components/Views/CalendarWeek";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";
import { checkDate, getWeek } from "~/lib/functions";
import type { ActionModel } from "~/lib/models";

export async function loader({ request, params, context }: LoaderArgs) {
  const {
    data: { session },
  } = await getUser(request, context);

  if (!session) throw new Error("No session");

  let period = checkDate(new URL(request.url).searchParams.get("date"));

  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      context,
      account: params.slug,
      user: session.user.id,
      period: period,
      mode: "week",
    }),
    getCampaigns(request, context, session?.user.id),
  ]);

  return { period, actions, campaigns };
}

export default function WeekPage() {
  const { period, actions } = useLoaderData<{
    period: string;
    actions: ActionModel[];
  }>();
  const { days } = getWeek({
    period,
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="items-center justify-between lg:flex">
        <div className="order-1">
          <CalendarHeader date={dayjs(period)} view="week" />
        </div>
        <div className="order-2">
          <DataFlow actions={actions} />
        </div>
      </div>
      <WeekView period={days} actions={actions} />
    </div>
  );
}
