import * as Popover from "@radix-ui/react-popover";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { scaleUp } from "~/lib/animations";
import { getMonth } from "~/lib/functions";

dayjs.locale("pt-br");

export default function DatepickerField({
  title,
  name,
  dates,
  index,
  pattern,
  full,
}: {
  title: string;
  name: string;
  dates?: [Dayjs, Dayjs];
  index: 0 | 1;
  pattern?: string;
  full?: boolean;
}) {
  const _dates = dates ?? [dayjs(), dayjs().add(7, "day")];

  let [selectedDay, setSelectedDay] = useState(_dates[index]);
  let [currentMonth, setCurrentMonth] = useState(selectedDay.format("YYYY-MM"));
  const { firstDayOfCurrentMonth, days } = getMonth({ period: currentMonth });

  const formatValue = (date: Dayjs) =>
    date.format(
      pattern ?? full ? "dddd, D [de] MMMM [de] YYYY" : "ddd, D/M/YY"
    );
  let [Value, setValue] = useState(formatValue(selectedDay));
  let [open, onOpenChange] = useState(false);

  return (
    <label className="field ">
      <div className="field-label">{title}</div>
      <input
        type="hidden"
        name={name}
        value={selectedDay.format("YYYY-MM-DD[T]HH:mm:ss")}
      />
      <Popover.Root open={open} onOpenChange={onOpenChange}>
        <Popover.Trigger asChild>
          <button className="field-default overflow-hidden text-ellipsis whitespace-nowrap text-sm first-letter:capitalize">
            {Value}
          </button>
        </Popover.Trigger>
        <AnimatePresence>
          {open && (
            <Popover.Portal forceMount={true}>
              <Popover.Content asChild forceMount={true}>
                <motion.div
                  {...scaleUp(0.3)}
                  className="dropdown-content p-4 text-center text-sm font-light antialiased outline-none data-[side=bottom]:origin-top data-[side=top]:origin-bottom dark:text-gray-200"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          firstDayOfCurrentMonth
                            .subtract(1, "month")
                            .format("YYYY-MM")
                        )
                      }
                    >
                      <ChevronLeft className="sq-4" />
                    </button>
                    <div className="text-xs font-medium uppercase tracking-wider">
                      {firstDayOfCurrentMonth.format("MMMM")}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          firstDayOfCurrentMonth
                            .add(1, "month")
                            .format("YYYY-MM")
                        )
                      }
                    >
                      <ChevronRight className="sq-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7">
                    {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
                      <div
                        key={index}
                        className="p-1 text-xs font-semibold text-gray-700 antialiased dark:text-gray-200"
                      >
                        {day}
                      </div>
                    ))}
                    {days.map((day, i) => (
                      <button
                        className={`mt-2 h-8 w-8 ${
                          day.format("YYYY-MM-DD") ===
                          selectedDay.format("YYYY-MM-DD")
                            ? `${
                                index === 0
                                  ? "rounded-l-full"
                                  : "rounded-r-full"
                              } bg-brand font-semibold text-white`
                            : (index === 0 &&
                                day.isAfter(selectedDay) &&
                                day.isBefore(_dates[1])) ||
                              (index === 1 &&
                                day.isAfter(_dates[0]) &&
                                day.isBefore(selectedDay))
                            ? " bg-brand font-semibold text-white"
                            : day.format("YYYY-MM-DD") ===
                              dayjs().format("YYYY-MM-DD")
                            ? "font-bold text-brand"
                            : day.format("YYYY-MM") !==
                              firstDayOfCurrentMonth.format("YYYY-MM")
                            ? " text-gray-500 "
                            : ""
                        }`}
                        key={i}
                        onClick={(event) => {
                          setValue(formatValue(day));
                          setSelectedDay(day);
                        }}
                      >
                        {day.format("D")}
                      </button>
                    ))}
                  </div>
                  {/* <div>
              <input
                type="text"
                className="appearance-none bg-transparent text-center  text-sm focus:outline-none"
                pattern="[0-2][0-9]:[0-5][0-9]:[0-5][0-9]"
                required
                value={format(selectedDay, "HH:mm:ss")}

              />
            </div> */}
                </motion.div>
              </Popover.Content>
            </Popover.Portal>
          )}
        </AnimatePresence>
      </Popover.Root>
    </label>
  );
}
