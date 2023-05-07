import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import Exclamation from "~/components/Exclamation";
import Button from "~/components/Button";
import CheckboxField from "~/components/Forms/CheckboxField";
import InputField from "~/components/Forms/InputField";
import { getAccount, getPersons, handleAction } from "~/lib/data";
import type { AccountModel, PersonModel } from "~/lib/models";

export const loader: LoaderFunction = async ({ request, params }) => {
  const [{ data: account }, { data: persons }] = await Promise.all([
    getAccount(request, params.slug),
    getPersons(request),
  ]);

  return { account, persons };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { data, error } = await handleAction(formData, request);

  if (formData.get("redirectTo")) {
    return redirect(formData.get("redirectTo") as string);
  }

  return { data, error };
};

export default function UserId() {
  const { account, persons } = useLoaderData<{
    account: AccountModel;
    persons: PersonModel[];
  }>();
  const actionData = useActionData<{
    data?: any;
    error?: { message: string };
  }>();

  return (
    <div className="h-full max-w-md flex-grow border-l p-4 dark:border-gray-800 md:w-1/2 lg:px-8">
      <h4 className="mb-4">Atualizar Cliente</h4>
      {actionData?.error && (
        <Exclamation type="error">{actionData.error.message}</Exclamation>
      )}
      <Form method="post" className="mt-4">
        <input type="hidden" name="action" value="update-account" />
        <input type="hidden" name="id" value={account.id} />

        <InputField name="name" label="Nome" value={account.name} />
        <InputField name="slug" label="Slug" value={account.slug} />
        <InputField name="short" label="Abreviação" value={account.short} />

        <div className="mt-8">
          {persons.map((person) => (
            <CheckboxField
              key={person.id}
              name="users"
              value={person.user_id}
              label={person.name}
              checked={
                account.users.filter((user) => user === person.user_id).length >
                0
              }
            />
          ))}
        </div>

        <div className="my-4 flex justify-end gap-2">
          <Form method="post">
            <input type="hidden" name="id" value={account.id} />
            <input type="hidden" name="action" value="delete-account" />
            <input
              type="hidden"
              name="redirectTo"
              value={`dashboard/admin/accounts`}
            />

            <Button>Excluir</Button>
          </Form>
          <Button type="submit" primary>
            Atualizar
          </Button>
        </div>
      </Form>
    </div>
  );
}
