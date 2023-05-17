import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import Button from "~/components/Button";
import Exclamation from "~/components/Exclamation";
import { getAccount, getActions, handleAction } from "~/lib/data";
import type { ActionModel } from "~/lib/models";

export const action: ActionFunction = async ({ request, context }) => {
  await handleAction(await request.formData(), request, context);
  return redirect("/dashboard/admin/accounts");
};

export const loader: LoaderFunction = async ({ params, request, context }) => {
  const [{ data: account }, { data: actions }] = await Promise.all([
    getAccount(request, context, params.slug),
    getActions({ request, context, account: params.slug, all: true }),
  ]);

  if (!account) {
    return redirect(`dashboard/admin/accounts`);
  }

  return { account, actions };
};

export default function AccountsIndex() {
  const { account, actions } = useLoaderData();

  return (
    <div className="no-scrollbars h-full overflow-y-auto border-l p-4 dark:border-gray-800 lg:px-8">
      <h3>
        Você está prestes a deletar a Conta:
        {account.name}
      </h3>

      <h4>E todas essas ações também serão excluídas:</h4>

      <div>
        {actions.map((action: ActionModel) => (
          <div key={action.id} className="py-2">
            {action.name}
          </div>
        ))}
      </div>
      <div className="mx-auto">
        <Exclamation type="alert">
          Essa ação não poderá ser desfeita
        </Exclamation>
      </div>
      <div className="mt-4">
        <Form method="post">
          <input type="hidden" name="action" value="delete-account" />
          <input type="hidden" name="id" value={account.id} />
          <Button primary type="submit">
            Excluir conta {account.name}
          </Button>
        </Form>
      </div>
    </div>
  );
}
