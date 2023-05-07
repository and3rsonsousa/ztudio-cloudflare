import { Link, useMatches } from "@remix-run/react";
import dayjs from "dayjs";
import type { ActionModel, CelebrationModel, PeriodType } from "~/lib/models";
import Badge from "../Badge";

const YearView = ({
  year,
  actions,
}: {
  year: PeriodType[];
  actions: ActionModel[];
}) => {
  const matches = useMatches();
  const celebrations: CelebrationModel[] = matches[1].data.celebrations;

  return (
    <div className="grid w-full grid-cols-2 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
      {/* Meses */}
      {year.map((month, index) => {
        const currentMonthCelebrations = celebrations.filter(
          (celebration) =>
            month[0].date.format("MM") ===
              celebration.date.substring(0, celebration.date.indexOf("/")) &&
            celebration.is_holiday
        );
        const currentActions = actions.filter((action) => {
          return (
            month[0].date.format("MM-YYYY") ===
            dayjs(action.date).format("MM-YYYY")
          );
        });

        return (
          <div key={index} className="col-span-1 flex flex-col p-4">
            <div className="relative mx-auto mb-2 rounded-xl py-1 px-4 text-center font-semibold transition first-letter:capitalize hover:bg-gray-800 ">
              <Link to={`../?date=${month[0].date.format("DD-MM-YYYY")}`}>
                {month[0].date.format("MMMM")}
              </Link>
              {currentActions.length > 0 && (
                <Badge size="small">{currentActions.length}</Badge>
              )}
            </div>
            <div className="grid w-full flex-auto grid-cols-7 text-center text-xs md:text-sm">
              {/* Dias */}
              {month.map((day, index) => {
                // const actionsOfThisDay = currentActions.filter(
                //   (action) =>
                //     dayjs(action.date).format("YYYY-MM-DD") ===
                //     day.date.format("YYYY-MM-DD")
                // );

                return (
                  <div
                    key={index}
                    className={`col-span-1 `}
                    style={{ gridColumnStart: day.date.day() + 1 }}
                  >
                    <Link
                      to={`../day?date=${day.date.format("DD-MM-YYYY")}`}
                      data-date={day.date.format("MM/DD")}
                      className={`relative grid h-6 w-6 place-items-center hover:underline md:h-8 md:w-8 ${
                        day.date.format("YYYY-MM-DD") ===
                        dayjs().format("YYYY-MM-DD")
                          ? "rounded-full bg-brand font-semibold text-white"
                          : currentMonthCelebrations.filter(
                              (celebration) =>
                                celebration.date === day.date.format("MM/DD")
                            ).length
                          ? "rounded-full bg-gray-100 font-bold dark:bg-gray-800"
                          : ""
                      }`}
                    >
                      {day.date.format("D")}
                    </Link>
                  </div>
                );
              })}
            </div>
            {currentMonthCelebrations.length > 0 && (
              <div className="text-xx">
                {currentMonthCelebrations.map((celebration) => (
                  <div key={celebration.id}>
                    {dayjs(celebration.date).format("D")} - {celebration.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default YearView;
