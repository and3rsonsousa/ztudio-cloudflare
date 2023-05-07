import dayjs from "dayjs";
import type { ActionModel } from "~/lib/models";
import { ActionMedium } from "../Actions";
import Exclamation from "../Exclamation";

export default function CalendarDay({
  actions,
  date,
}: {
  actions: ActionModel[];
  date: string;
}) {
  let isEmpty = 0;
  return (
    <div className="p-2">
      {Array(24)
        .fill(0)
        .map((h, index) => {
          const currentActions: ActionModel[] | undefined = actions?.filter(
            (action) => dayjs(action.date).format("H") === index.toString()
          );

          if (currentActions && currentActions.length > 0) {
            isEmpty += 1;
          }

          return (
            currentActions &&
            currentActions.length > 0 && (
              <div
                key={index}
                className="flex gap-4 border-b p-2 dark:border-gray-800"
              >
                <div className="text-xl font-medium">{index}h</div>
                <div className="grid w-full grid-cols-3 gap-x-2 xl:grid-cols-4 3xl:grid-cols-6 ">
                  {currentActions.map((action) => (
                    <div key={action.id}>
                      <ActionMedium action={action} />
                    </div>
                  ))}
                </div>
              </div>
            )
          );
        })}
      {isEmpty === 0 && (
        <div>
          <Exclamation>Nenhuma ação nesse dia</Exclamation>
        </div>
      )}
    </div>
  );
}
