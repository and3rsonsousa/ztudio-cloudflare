import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import Button from "~/components/Button";
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
      <div className="rounded-lg bg-error-600 p-8 text-center ">
        <div className="text-xl font-bold text-error-200">
          Você está prestes a deletar a Conta:
        </div>
        <div className="text-3xl font-bold text-white"> {account.name} </div>
      </div>
      <div className="my-8 text-xl">
        E todas essas ações também serão excluídas:
      </div>
      <div>
        {actions.map((action: ActionModel) => (
          <div key={action.id} className="py-2">
            {action.name}
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg bg-error-600 p-4 text-white">
        Estou ciente que essa ação é irreversível e desejo prosseguir.
      </div>
      <div className="mt-4 text-center">
        <Form method="post">
          <input type="hidden" name="action" value="delete-account" />
          <input type="hidden" name="id" value={account.id} />
          <Button type="submit">Excluir conta {account.name}</Button>
        </Form>
      </div>
    </div>
  );
}
