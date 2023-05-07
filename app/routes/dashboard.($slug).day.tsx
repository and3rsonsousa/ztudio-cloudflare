import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import CalendarHeader from "~/components/Views/CalendarHeader";
import { getUser } from "~/lib/auth.server";
import { getActions, getCampaigns } from "~/lib/data";
import type { ActionModel } from "~/lib/models";

import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Scrollable from "~/components/Scrollable";
import CalendarDay from "~/components/Views/CalendarDay";
import { checkDate } from "~/lib/functions";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");
dayjs.tz.setDefault("America/Fortaleza");

export async function loader({ params, request, context }: LoaderArgs) {
  const {
    data: { session },
  } = await getUser(request, context);

  if (!session) throw new Error("No session");

  let date = checkDate(new URL(request.url).searchParams.get("date"));

  const [{ data: actions }, { data: campaigns }] = await Promise.all([
    getActions({
      request,
      context,
      account: params.slug,
      user: session.user.id,
      period: date,
      mode: "day",
    }),
    getCampaigns(request, context, session.user.id),
  ]);

  return { date, actions, campaigns };
}

export default function DayPage() {
  const { date, actions } = useLoaderData<{
    date: string;
    actions: ActionModel[];
  }>();

  return (
    <div className="lg:h-screen lg:overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-4">
        <div>
          <CalendarHeader date={dayjs(date)} view="day" />
        </div>
      </div>
      <Scrollable>
        <CalendarDay date={date} actions={actions} />
      </Scrollable>
    </div>
  );
}
