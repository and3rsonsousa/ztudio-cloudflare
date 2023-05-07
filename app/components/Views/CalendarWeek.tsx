import { useMatches } from "@remix-run/react";
import dayjs from "dayjs";
import type { ActionModel, CelebrationModel, PeriodType } from "~/lib/models";
import ActionList from "../ActionList";
import Celebration from "../Celebrations";

const WeekView = ({
  period,
  actions,
}: {
  period: PeriodType;
  actions: ActionModel[];
}) => {
  const matches = useMatches();
  const celebrations: CelebrationModel[] = matches[1].data.celebrations;

  return (
    <>
      <div className="grid w-full grid-cols-7">
        {period.map((day, index) => {
          return (
            <div key={index} className="px-1">
              <div
                className={`grid h-8 w-8 place-items-center text-sm font-medium ${
                  day.date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
                    ? "rounded-full bg-brand text-white"
                    : undefined
                }`}
              >
                {day.date.format("D")}
              </div>
              <div>
                {celebrations
                  .filter(
                    (celebration) =>
                      dayjs(celebration.date).format("MM/DD") ===
                      day.date.format("MM/DD")
                  )
                  .map((celebration) => (
                    <Celebration
                      key={celebration.id}
                      celebration={celebration}
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid h-full w-full grid-cols-7 overflow-hidden">
        {period.map((day, index) => {
          return (
            <div key={index} className="h-full flex-auto overflow-hidden">
              <ActionList
                actions={actions.filter(
                  (action) =>
                    dayjs(action.date).format("YYYY-MM-DD") ===
                    day.date.format("YYYY-MM-DD")
                )}
                showDateAndTime
                className="p-2"
                wrap
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default WeekView;
