import { useMatches } from "@remix-run/react";
import dayjs from "dayjs";
import type { ActionModel, ItemModel } from "~/lib/models";

const DataFlow = ({ actions }: { actions: ActionModel[] }) => {
  const matches = useMatches();
  if (actions.length === 0) {
    return null;
  }
  const stages: ItemModel[] = matches[1].data.stages;
  const Stages = stages.map((stage) => ({
    stage,
    actions: actions.filter((action) => action.stage.slug === stage.slug)
      .length,
  }));

  const total = actions.length;
  const accomplished = actions.filter(
    (action) => action.stage.slug === "accomplished"
  ).length;
  const late = actions.filter(
    (action) =>
      dayjs(action.date).isBefore(dayjs()) &&
      action.stage.slug !== "accomplished"
  ).length;
  return (
    <div className="flex">
      <div className="px-2 text-center md:px-4">
        <div className="font-bold">{total} AÇÕES</div>
        <div className="mt-1 hidden h-1 overflow-hidden rounded-full bg-gray-700 md:flex">
          {Stages.reverse().map((stage) => (
            <div
              key={stage.stage.id}
              className={`bg-${stage.stage.slug} h-1 flex-auto`}
              style={{
                width: `${Math.floor((stage.actions / total) * 100)}%`,
              }}
            ></div>
          ))}
        </div>
      </div>
      <div
        className={`px-2 text-center ${
          accomplished > total * 0.9
            ? "text-success-500"
            : accomplished > total / 3
            ? "text-alert-500"
            : "text-error-500"
        } md:px-4`}
      >
        <div className="font-medium">
          {Math.floor((accomplished / total) * 100)}%
        </div>
        <div className="hidden text-[8px] font-bold uppercase tracking-[1px] md:block">
          concluídos
        </div>
      </div>
      {late > 0 ? (
        <div className={`px-2 text-center text-error-500 md:px-4`}>
          <div className="font-medium">{late}</div>
          <div className="hidden text-[8px] font-bold uppercase tracking-[1px] md:block">
            atrasadas
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default DataFlow;
