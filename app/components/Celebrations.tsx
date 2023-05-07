import { useFetcher } from "@remix-run/react";
import { Star, Trash2 } from "lucide-react";
import type { CelebrationModel } from "~/lib/models";

const Celebration = ({
  celebration,
  small,
}: {
  celebration: CelebrationModel;
  small?: boolean;
}) => {
  const fetcher = useFetcher();

  return (
    <div
      className={`group flex w-full items-center justify-between text-gray-500  ${
        small ? "my-0.5 text-xx" : "my-1 text-xs"
      } font-normal`}
      title={celebration.name}
    >
      <div className="flex flex-auto items-center gap-1 overflow-hidden">
        {celebration.is_holiday ? <Star className="sq-3 shrink-0" /> : null}
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {celebration.name}
        </div>
      </div>
      {!small && (
        <div className="opacity-0 transition group-hover:opacity-100">
          <button
            className="appearance-none align-middle"
            tabIndex={-1}
            onClick={() => {
              fetcher.submit(
                {
                  id: celebration.id as string,
                  action: "delete-celebration",
                },
                {
                  action: "/handle-action",
                  method: "delete",
                }
              );
            }}
          >
            <Trash2 className="sq-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Celebration;
