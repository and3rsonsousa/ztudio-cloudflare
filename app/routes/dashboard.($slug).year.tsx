import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import CalendarHeader from "~/components/CalendarHeader";
import Scrollable from "~/components/Scrollable";
import CalendarYear from "~/components/Views/CalendarYear";
import { getUser } from "~/lib/auth.server";
import { getActions } from "~/lib/data";
import { checkDate, getYear } from "~/lib/functions";
import type { ActionModel } from "~/lib/models";

export async function loader({ request, params }: LoaderArgs) {
  const {
    data: { session },
  } = await getUser(request);

  let date = new URL(request.url).searchParams.get("date");
  date = checkDate(date);

  const { data: actions } = await getActions({
    request,
    account: params.slug,
    user: session?.user.id,
    period: date,
    mode: "year",
  });

  return { date, actions };
}

export default function YearPage() {
  const { date, actions } = useLoaderData();

  const period = dayjs(date);
  const { year } = getYear({ period: date });

  return (
    <div className="lg:h-screen lg:overflow-hidden">
      <div>
        <CalendarHeader date={period} view="year" />
      </div>
      <Scrollable>
        <CalendarYear year={year} actions={actions as ActionModel[]} />
      </Scrollable>
    </div>
  );
}
