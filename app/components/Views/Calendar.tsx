import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMatches, useOutletContext, useParams } from "@remix-run/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { AlarmCheck, CheckCircle, Clock, Filter, Layers } from "lucide-react";
import { useState } from "react";
import { SHORTCUTS } from "~/lib/constants";
import { getMonth } from "~/lib/functions";
import type {
  ActionModel,
  CampaignModel,
  CelebrationModel,
  ContextType,
  DayModel,
  ItemModel,
} from "~/lib/models";
import Day from "../CalendarDayGrid";
import CalendarHeader from "../CalendarHeader";
import DataFlow from "../DataFlow";
import DayInfo from "../DayInfo";
import InstagramGrid from "../InstagramGrid";
import Scrollable from "../Scrollable";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("pt-br");

export default function Calendar({
  actions,
  campaigns,
  grid,
  date,
}: {
  actions: ActionModel[];
  campaigns: CampaignModel[];
  date: string;
  grid?: boolean;
}) {
  const { slug } = useParams();
  const context: ContextType = useOutletContext();

  const currentMonth = date;
  const matches = useMatches();
  let height = 0;
  const celebrations: CelebrationModel[] = matches[1].data.celebrations;
  const categories: ItemModel[] = matches[1].data.categories;
  const today = dayjs();

  const { firstDayOfCurrentMonth, days: newDays } = getMonth({
    period: currentMonth,
  });

  let [selectedDay, setSelectedDay] = useState(today.format("YYYY-MM-DD"));

  const days = newDays.map((day) => {
    let _day: DayModel = {
      date: day,
      actions: [],
      celebrations: [],
      campaigns: [],
    };

    _day.actions = actions.filter((action) => {
      return (
        dayjs(action.date).format("YYYY-MM-DD") ===
          _day.date.format("YYYY-MM-DD") &&
        (context.filter.option === "all" ||
          action.category.slug === context.filter.option)
      );
    });

    if (celebrations) {
      _day.celebrations = celebrations.filter((celebration) => {
        return (
          _day.date.format("MM-DD") === dayjs(celebration.date).format("MM-DD")
        );
      });
    }
    _day.campaigns = campaigns.filter((campaign) => {
      return (
        day.isSameOrAfter(dayjs(campaign.date_start), "day") &&
        day.isSameOrBefore(dayjs(campaign.date_end), "day")
      );
    });

    return _day;
  });

  let arrangeDropdownItems = [
    {
      title: SHORTCUTS.ARRANGE_ALL.does,
      value: SHORTCUTS.ARRANGE_ALL.value,
      shortcut: SHORTCUTS.ARRANGE_ALL.shortcut,
    },
    {
      title: SHORTCUTS.ARRANGE_CATEGORIES.does,
      value: SHORTCUTS.ARRANGE_CATEGORIES.value,
      shortcut: SHORTCUTS.ARRANGE_CATEGORIES.shortcut,
    },
  ];
  if (!slug)
    arrangeDropdownItems.push({
      title: SHORTCUTS.ARRANGE_ACCOUNTS.does,
      value: SHORTCUTS.ARRANGE_ACCOUNTS.value,
      shortcut: SHORTCUTS.ARRANGE_ACCOUNTS.shortcut,
    });

  // useEffect(() => {
  //   if (window) {
  //     const viewport = document.querySelector(".calendar-days");

  //     viewport
  //       ?.querySelector(`div[date-attr="${dayjs().format("YYYY-MM-DD")}"]`)
  //       ?.scrollIntoView();
  //   }
  // }, []);

  return (
    <div className="calendar flex flex-col lg:h-full lg:overflow-hidden">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between md:flex-nowrap">
        <div className="order-1">
          <CalendarHeader date={firstDayOfCurrentMonth} />
        </div>

        <div className="order-3 md:order-2">
          <DataFlow actions={actions} />
        </div>

        <div className="order-2 flex gap-1 px-4 md:order-3">
          <label className={`flex cursor-pointer gap-2`}>
            <input
              type="checkbox"
              className="hidden"
              checked={context.priority.option}
              onChange={() => context.priority.set((prev) => !prev)}
            />
            <div
              className={`grid h-8 w-8 place-items-center rounded-xl md:h-10 md:w-10 ${
                context.priority.option
                  ? "bg-brand text-white"
                  : "text-gray-400"
              }`}
              title="Cmd + K → H ( Ordenar por prioridade de status )"
            >
              <AlarmCheck className="w-5" />
            </div>
            <div
              className={`grid h-8 w-8 place-items-center rounded-xl md:h-10 md:w-10  ${
                !context.priority.option
                  ? "bg-brand text-white"
                  : "text-gray-400"
              }`}
              title="Cmd K → H ( Ordenar por horário de conclusão )"
            >
              <Clock className={`w-5`} />
            </div>
          </label>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className={`grid h-8 w-8 place-items-center rounded-lg dark:hover:text-white md:h-10 md:w-10 ${
                context.arrange.option !== "arrange_all"
                  ? "bg-brand text-white"
                  : "text-gray-400"
              }`}
              title="Agrupar Ações"
            >
              <Layers className="w-5" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="dropdown-content">
                {arrangeDropdownItems.map((item, index) => (
                  <DropdownMenu.Item
                    key={index}
                    title={`Cmd + K → ${item.shortcut}`}
                    className="dropdown-item item-small"
                    onSelect={() => {
                      if (
                        context.filter.option !== "all" &&
                        item.value === "arrange_category"
                      ) {
                        context.filter.set("all");
                      }
                      context.arrange.set(item.value);
                    }}
                  >
                    {item?.title.substring(item.title.indexOf(" ") + 1)}
                    {context.arrange.option === item.value && (
                      <CheckCircle className="sq-4" />
                    )}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className={`grid h-8 w-8 place-items-center rounded-lg text-gray-400 dark:hover:text-white md:h-10 md:w-10 bg-${context.filter.option}`}
            >
              <Filter className="w-5" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="dropdown-content">
                <DropdownMenu.Item
                  className="dropdown-item item-small"
                  onSelect={() => {
                    context.filter.set("all");
                  }}
                  title={`Cmd + K → 0`}
                >
                  Todos
                  {context.filter.option === "all" && (
                    <CheckCircle className="sq-4 w-4" />
                  )}
                </DropdownMenu.Item>
                {categories.map((category, index) => (
                  <DropdownMenu.Item
                    key={index}
                    title={`Cmd + K → ${index + 1}`}
                    className="dropdown-item item-small"
                    onSelect={() => {
                      if (context.arrange.option === "arrange_category") {
                        context.arrange.set("arrange_all");
                      }
                      context.filter.set(category.slug);
                    }}
                  >
                    {category.name}
                    {context.filter.option === category.slug && (
                      <CheckCircle className="sq-4" />
                    )}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <div className="flex-auto lg:flex lg:overflow-hidden">
        {/* Calendar  */}

        <div className="relative flex flex-auto flex-col lg:h-full">
          <div className="relative grid grid-cols-7">
            {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
              (day, index) => (
                <div key={index} className="calendar-weekday">
                  {day}
                </div>
              )
            )}
            <div className="absolute bottom-0 left-0 right-0 h-[1px]  bg-gradient-to-r from-transparent dark:via-gray-700"></div>
          </div>

          <Scrollable>
            <div className="calendar-days grid flex-auto grid-cols-7">
              {days.map((day, index) => {
                if (index % 7 === 0) {
                  height = 0;
                  for (let i = index; i < index + 7; i++) {
                    if (days[i].campaigns.length > height) {
                      height = days[i].campaigns.length;
                    }
                  }
                }

                return (
                  <Day
                    key={index}
                    day={day}
                    height={height}
                    firstDayOfCurrentMonth={firstDayOfCurrentMonth}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    arrange={context.arrange.option}
                  />
                );
              })}
            </div>
          </Scrollable>
        </div>
        {/* Info */}

        {grid ? (
          <InstagramGrid actions={actions} />
        ) : (
          <DayInfo
            day={
              days.filter(
                (day) =>
                  day.date.format("YYYY-MM-DD") ===
                  dayjs(selectedDay).format("YYYY-MM-DD")
              )[0]
            }
          />
        )}
      </div>
    </div>
  );
}
