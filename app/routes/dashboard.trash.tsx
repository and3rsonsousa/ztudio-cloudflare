import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Actions } from "~/components/Actions";
import Scrollable from "~/components/Scrollable";
import { getActions } from "~/lib/data";

export const loader: LoaderFunction = async ({ request, context }) => {
  const { data } = await getActions({
    request,
    context,
    all: true,
    where: "trash",
  });

  return {
    actions: data,
  };
};

export default function TrashPage() {
  const { actions } = useLoaderData();
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-auto items-center justify-between border-b p-4 dark:border-gray-800">
        <h2 className="mb-0 overflow-hidden text-ellipsis whitespace-nowrap  dark:text-gray-200">
          Lixeira
        </h2>
      </div>

      <div className="flex-auto overflow-hidden">
        <Scrollable>
          <div className="p-4">
            <Actions actions={actions} />
          </div>
        </Scrollable>
      </div>
    </div>
  );
}
