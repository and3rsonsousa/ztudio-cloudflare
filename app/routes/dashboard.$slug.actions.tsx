import type { LoaderArgs, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Actions } from "~/components/Actions";
import { getActions } from "~/lib/data";
import type { ActionModel } from "~/lib/models";
dayjs.locale("pt-br");

export const loader: LoaderFunction = async ({
  request,
  context,
  params,
}: LoaderArgs) => {
  const { data } = await getActions({
    request,
    context,
    all: true,
    account: params.slug,
  });

  return { actions: data };
};

export default function ActionsPages() {
  const { actions } = useLoaderData<{ actions: ActionModel[] }>();

  return <Actions actions={actions} />;
}
