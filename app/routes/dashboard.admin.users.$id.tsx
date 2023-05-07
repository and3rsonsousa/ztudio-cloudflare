import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import Exclamation from "~/components/Exclamation";
import Button from "~/components/Button";
import InputField from "~/components/Forms/InputField";
import { getPerson, handleAction } from "~/lib/data";
import type { PersonModel } from "~/lib/models";

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { data: person } = await getPerson(
    params.id as string,
    request,
    context
  );

  return { person };
};

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();

  const { data, error } = await handleAction(formData, request, context);

  return { data, error };
};

export default function UserId() {
  const actionData = useActionData<{
    data?: any;
    error?: { message: string };
  }>();

  const { person } = useLoaderData<{ person: PersonModel }>();

  return (
    <div className="h-full w-1/2 max-w-md border-l p-4 dark:border-gray-800 lg:px-8">
      <h4 className="mb-4">Atualizar Usuário</h4>
      {actionData?.error && (
        <Exclamation type="error">{actionData.error.message}</Exclamation>
      )}
      <Form method="post" className="mt-4">
        <input type="hidden" name="action" value="update-person" />
        <input type="hidden" name="id" value={person.id} />

        <InputField name="name" label="Nome" value={person.name} />

        <div className="my-4">
          <Exclamation type="alert" icon>
            Somente o próprio usuário pode mudar seu email e sua senha.
          </Exclamation>
        </div>

        <div className="flex justify-end">
          <Button type="submit" primary>
            Atualizar
          </Button>
        </div>
      </Form>
    </div>
  );
}
