import {
  Link,
  useFetcher,
  useMatches,
  useOutletContext,
} from "@remix-run/react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { ExternalLink } from "lucide-react";
import {
  actionsByAccount,
  actionsByCategory,
  actionsByPriority,
} from "~/lib/functions";
import type {
  AccountModel,
  ContextType,
  DayModel,
  ItemModel,
} from "~/lib/models";
import { ActionLine } from "./Actions";
import Button from "./Button";
import { CampaignLine } from "./Campaign";
import Celebration from "./Celebrations";

export default function Day({
  day,
  selectedDay,
  firstDayOfCurrentMonth,
  height,
  setSelectedDay,
  arrange,
}: {
  day: DayModel;
  selectedDay: string;
  firstDayOfCurrentMonth: Dayjs;
  height: number;
  setSelectedDay: (date: string) => void;
  arrange: string;
}) {
  const fetcher = useFetcher();
  const matches = useMatches();
  const categories: ItemModel[] = matches[1].data.categories;
  const accounts: AccountModel[] = matches[1].data.accounts;

  const context: ContextType = useOutletContext();

  return (
    <div
      data-date={day.date.format("YYYY-MM-DD[T]HH:mm")}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.classList.add("dragover");
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove("dragover");
      }}
      onDrop={(e) => {
        e.currentTarget.classList.remove("dragover");

        const dragging = document.querySelector(".dragging");
        const id = dragging?.getAttribute("data-id") as string;
        const draggingDate = dragging?.getAttribute("data-date") as string;
        const dropDate = e.currentTarget.getAttribute("data-date") as string;

        fetcher.submit(
          {
            action: "update-date",
            date: `${dayjs(dropDate).format("YYYY-MM-DD")}T${dayjs(
              draggingDate
            ).format("HH:mm")}`,
            id,
          },
          {
            action: "/handle-action",
            method: "post",
          }
        );
      }}
      className={`calendar-day group ${
        day.date.format("MM") === firstDayOfCurrentMonth.format("MM")
          ? ""
          : " not-this-month"
      }${
        dayjs(selectedDay).format("YYYY-MM-DD") ===
        day.date.format("YYYY-MM-DD")
          ? " is-selected"
          : ""
      } flex flex-col justify-between`}
      date-attr={day.date.format("YYYY-MM-DD")}
    >
      <div>
        <div className="flex items-center gap-1 px-2 lg:px-1">
          <Button
            icon
            small
            squared
            className={
              day.date.format("MM") !== firstDayOfCurrentMonth.format("MM") &&
              dayjs(selectedDay).format("YYYY-MM-DD") !==
                day.date.format("YYYY-MM-DD")
                ? "opacity-25"
                : ""
            }
            link={
              dayjs(selectedDay).format("YYYY-MM-DD") !==
                day.date.format("YYYY-MM-DD") &&
              dayjs().format("YYYY-MM-DD") !== day.date.format("YYYY-MM-DD")
            }
            primary={
              dayjs(selectedDay).format("YYYY-MM-DD") ===
              day.date.format("YYYY-MM-DD")
            }
            onClick={() => {
              context.date.set(day.date);
              setSelectedDay(day.date.format("YYYY-MM-DD"));
            }}
          >
            {day.date.format("D")}
          </Button>
          <Link
            className="uppercase transition lg:opacity-0 lg:group-hover:opacity-100"
            to={`/dashboard/day/${day.date.format("DD-MM-YYYY")}`}
          >
            <ExternalLink className="sq-4 w-4" />
          </Link>
        </div>

        {/* Campanhas Campaigns */}

        <div className={`mt-2 ${height > 0 ? "mb-2 pb-2" : ""}`}>
          <div style={{ height: 24 * height + (height - 1) * 4 + "px" }}>
            {day.campaigns.map((campaign) => (
              <div key={campaign.id} className="relative mt-1 h-6">
                {/* Caso seja oprimeiro dia
              ou seja o primeiro da semana */}
                {day.date.format("YYYY-MM-DD") ===
                  dayjs(campaign.date_start).format("YYYY-MM-DD") ||
                day.date.day() === 0 ? (
                  <div
                    className={`absolute z-10 overflow-hidden ${
                      // Caso seja o primeiro dia
                      day.date.format("YYYY-MM-DD") ===
                      dayjs(campaign.date_start).format("YYYY-MM-DD")
                        ? // Caso o último dia esteja na mesma linha
                          dayjs(campaign.date_end).diff(day.date, "days") < 7
                          ? " ml-1 rounded-md"
                          : " ml-1 rounded-l-md"
                        : // Caso não seja o primeiro dia, mas representa o último
                        dayjs(campaign.date_end).diff(day.date, "days") < 7
                        ? " rounded-r-md "
                        : ""
                    }`}
                    style={{
                      width: ` calc(${
                        //Caso o último dia não seja na mesma linha
                        (dayjs(campaign.date_end).diff(day.date, "days") > 7
                          ? //quantos dias falta para o último
                            7 - day.date.day()
                          : //Caso o último dia esteja na mesma linha
                            dayjs(campaign.date_end).diff(day.date, "days") +
                            1) * 100
                      }% - ${
                        dayjs(campaign.date_end).diff(day.date, "days") < 7
                          ? dayjs(campaign.date_start).format("YYYY-MM-DD") ===
                            day.date.format("YYYY-MM-DD")
                            ? 8
                            : 4
                          : 0
                      }px)`,
                    }}
                  >
                    <CampaignLine campaign={campaign} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className={`space-y-4`}>
          {arrange === "arrange_category"
            ? actionsByCategory(
                day.actions,
                categories,
                context.priority.option
              ).map(
                (category, index) =>
                  category.actions?.length !== 0 && (
                    <div key={index}>
                      <div className="mb-1 flex items-center gap-2">
                        <div
                          className={`mb-1/2 h-1 w-1 rounded-full bg-${category.category.slug}`}
                        ></div>
                        <div
                          className={`text-xx font-bold uppercase tracking-[1px] text-gray-700 dark:text-gray-300`}
                        >
                          {category.category?.name}
                        </div>
                      </div>
                      {category.actions?.map((action, index) => (
                        <ActionLine key={index} action={action} />
                      ))}
                    </div>
                  )
              )
            : arrange === "arrange_account"
            ? actionsByAccount(
                day.actions,
                accounts,
                context.priority.option
              ).map(
                (account, index) =>
                  account.actions?.length !== 0 && (
                    <div key={index}>
                      <div className="mb-1 flex items-center gap-2">
                        <div
                          className={`mb-1/2 h-1 w-1 rounded-full bg-brand`}
                        ></div>
                        <div
                          className={`text-[10px] font-bold uppercase tracking-[1px] text-gray-700 dark:text-gray-300`}
                        >
                          {account.account?.short}
                        </div>
                      </div>
                      {account.actions?.map((action, index) => (
                        <ActionLine key={index} action={action} />
                      ))}
                    </div>
                  )
              )
            : context.priority.option
            ? actionsByPriority(day.actions).map((action, index) => (
                <ActionLine key={index} action={action} />
              ))
            : day.actions.map((action, index) => (
                <ActionLine key={index} action={action} />
              ))}
        </div>
      </div>

      <div className="p-1">
        {day.celebrations.map((celebration) => (
          <Celebration celebration={celebration} key={celebration.id} small />
        ))}
      </div>
    </div>
  );
}
