import type {
  ActionFunction,
  LoaderArgs,
  LoaderFunction,
} from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import {
  useActionData,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import ActionList from "~/components/ActionList";
import AddActionDialog from "~/components/Dialogs/ActionDialog";
import Exclamation from "~/components/Exclamation";
import Scrollable from "~/components/Scrollable";
import { getAction, getActions, getCampaigns, handleAction } from "~/lib/data";
import type { ActionModel, ContextType } from "~/lib/models";

export const action: ActionFunction = async ({
  request,
  context,
  params,
}: LoaderArgs) => {
  const formData = await request.formData();
  const { error } = await handleAction(formData, request, context);
  const redirectTo = new URL(request.url).searchParams.get("redirectTo");

  if (error) return { error };
  return redirect(redirectTo ?? `/dashboard/${params.slug}`);
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const [{ data: action }, { data: actions }, { data: campaigns }] =
    await Promise.all([
      getAction(request, context, params.id as string),
      getActions({ request, context, account: params.slug }),
      getCampaigns(request, context, "", params.slug),
    ]);

  return { action, actions, campaigns };
};

export default function ActionPage() {
  const { action, actions } = useLoaderData<{
    action: ActionModel;
    actions: ActionModel[];
  }>();
  const context: ContextType = useOutletContext();
  const actionData = useActionData<{ error: { message: string } }>();

  return (
    <div className="overflow-hidden">
      <div className="mx-auto h-full max-w-5xl grid-cols-3 overflow-hidden lg:grid">
        <div className="col-span-2 h-full overflow-hidden overflow-y-auto">
          {actionData && (
            <Exclamation type="error">{actionData.error.message}</Exclamation>
          )}
          <Scrollable>
            <div className="p-4">
              <AddActionDialog action={action} context={context} />
            </div>
          </Scrollable>
        </div>
        <div className="col-span-1 h-full overflow-hidden p-4">
          <h4 className="px-4">Ações recentes</h4>
          <ActionList
            actions={actions}
            hideAccount
            showDateAndTime
            className="p-4"
          />
        </div>
      </div>
    </div>
  );
}
