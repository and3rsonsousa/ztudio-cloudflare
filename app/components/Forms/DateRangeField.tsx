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
  names,
  day1,
  day2,
  full,
}: {
  title: string;
  names: Array<string>;
  day1?: Dayjs;
  day2?: Dayjs;
  full?: boolean;
}) {
  let [which, setWhich] = useState<"day1" | "day2">("day1");
  let [_day1, setDay1] = useState(day1 ?? dayjs());
  let [_day2, setDay2] = useState(day2);
  let [currentMonth, setCurrentMonth] = useState(_day1.format("YYYY-MM"));
  const { firstDayOfCurrentMonth, days } = getMonth({ period: currentMonth });

  const formatedValue = _day1
    .format(full ? `D [de] MMMM [a] ` : "DD/MM - ")
    .concat(_day2 ? _day2.format(full ? "D [de] MMMM" : "DD/MM") : "???");

  let [open, onOpenChange] = useState(false);

  return (
    <label className="field">
      <div className="field-label">{title}</div>
      <input
        type="hidden"
        name={names[0]}
        value={_day1.format("YYYY-MM-DD[T]HH:mm:ss")}
      />
      <input
        type="hidden"
        name={names[1]}
        value={_day2 ? _day2.format("YYYY-MM-DD[T]HH:mm:ss") : ""}
      />
      <Popover.Root open={open} onOpenChange={onOpenChange}>
        <Popover.Trigger asChild>
          <button className="field-default overflow-hidden text-ellipsis whitespace-nowrap first-letter:capitalize">
            {formatedValue}
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
                          _day1.format("YYYY-MM-DD")
                            ? ` ${
                                _day2 ? "rounded-l-xl" : "rounded-xl"
                              } bg-brand font-semibold text-white`
                            : _day2 &&
                              day.format("YYYY-MM-DD") ===
                                _day2.format("YYYY-MM-DD")
                            ? `rounded-r-xl bg-brand font-semibold text-white`
                            : day.isAfter(_day1) && day.isBefore(_day2)
                            ? " bg-brand font-semibold text-white "
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
                          if (day.isBefore(_day1)) {
                            setDay1(() => day);
                          } else if (day.isAfter(_day2)) {
                            setDay2(() => day);
                          } else if (which === "day1") {
                            if (day.isBefore(_day2)) {
                              setDay1(() => day);
                            } else if (_day2 && day.isAfter(_day2)) {
                              setDay1(_day2);
                              setDay2(day);
                            }
                            setWhich("day2");
                          } else {
                            if (day.isAfter(_day1)) {
                              setDay2(day);
                            } else if (day.isBefore(_day1)) {
                              setDay2(_day1);
                              setDay1(day);
                            }
                            setWhich("day1");
                          }
                        }}
                      >
                        {day.format("D")}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </Popover.Content>
            </Popover.Portal>
          )}
        </AnimatePresence>
      </Popover.Root>
    </label>
  );
}
