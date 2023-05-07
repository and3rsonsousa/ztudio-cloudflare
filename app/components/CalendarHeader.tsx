import { Link, useParams } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isToday } from "~/lib/functions";
import Button from "./Button";

import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");
dayjs.tz.setDefault("America/Fortaleza");

export default function CalendarHeader({
  date,
  view = "month",
}: {
  date: Dayjs;
  view?: "year" | "month" | "week" | "day";
}) {
  const { slug } = useParams();
  const url = "/dashboard/" + (slug ? slug + "/" : "");

  return (
    <div className="flex w-full items-center justify-between gap-2 md:w-auto lg:justify-start">
      {/* Mês e ano */}
      <h4 className="mb-0 py-4 px-2 first-letter:capitalize">
        {view === "year" ? (
          date.format("YYYY")
        ) : view === "week" ? (
          `${getWrittenDate(date.startOf("week"))} a ${getWrittenDate(
            date.endOf("week")
          )}${
            isOnSameMonth(date.startOf("week"), date.endOf("week")) &&
            isOnSameYear(date.startOf("week"), date.endOf("week"))
              ? date.format(" [de] MMMM")
              : ""
          }`
        ) : view === "day" ? (
          <>
            {dayjs(date).format("DD [de] MMMM [de] YYYY")}
            {isToday(date) ? " (HOJE)" : ""}
          </>
        ) : (
          date.format("MMMM [de] YYYY")
        )}
      </h4>

      {/* Botões para mês e ano */}

      <div className="item-center flex">
        <Button link small icon squared asChild>
          <a
            href={(view === "year"
              ? "?date="
              : view === "week"
              ? "?date="
              : view === "day"
              ? `?date=`
              : "?date="
            ).concat(date.subtract(1, view).format("DD-MM-YYYY"))}
          >
            <ChevronLeft />
          </a>
        </Button>
        <Button link small icon squared asChild>
          <a
            href={(view === "year"
              ? "?date="
              : view === "week"
              ? "?date="
              : view === "day"
              ? `?date=`
              : "?date="
            ).concat(date.add(1, view).format("DD-MM-YYYY"))}
          >
            <ChevronRight />
          </a>
        </Button>
      </div>
      <div className="flex items-center gap-2 text-xx font-bold tracking-widest">
        <Link
          className={
            view === "year" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`${url}year?date=${dayjs().format("DD-MM-YYYY")}`}
        >
          ANO
        </Link>
        <Link
          className={
            view === "month" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`${url}?date=${dayjs().format("DD-MM-YYYY")}`}
        >
          MÊS
        </Link>
        <Link
          className={
            view === "week" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`${url}week?date=${dayjs().format("DD-MM-YYYY")}`}
        >
          SEMANA
        </Link>
        <Link
          className={
            view === "day" ? "rounded-full bg-brand px-2 py-1 text-white" : ""
          }
          to={`${url}day?date=${dayjs().format("DD-MM-YYYY")}`}
        >
          DIA
        </Link>
      </div>
    </div>
  );
}

function getWrittenDate(date: Dayjs) {
  return `${date.format("D")}${
    isOnSameYear(date.startOf("week"), date.endOf("week"))
      ? !isOnSameMonth(date.startOf("week"), date.endOf("week"))
        ? date.format(" [de] MMMM")
        : ""
      : date.format(" [de] MMMM [de] YYYY")
  }`;
}

function isOnSameYear(start: Dayjs, end: Dayjs) {
  return start.format("YYYY") === end.format("YYYY");
}

function isOnSameMonth(start: Dayjs, end: Dayjs) {
  return start.format("MM") === end.format("MM");
}
