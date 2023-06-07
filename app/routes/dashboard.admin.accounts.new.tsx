import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import {
  Form,
  useActionData,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import Button from "~/components/Button";
import Exclamation from "~/components/Exclamation";
import CheckboxField from "~/components/Forms/CheckboxField";
import InputField from "~/components/Forms/InputField";
import { getPersons } from "~/lib/data";
import type { PersonModel } from "~/lib/models";
import { getSupabase } from "~/lib/supabase";

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const { supabase } = getSupabase(request, context);

  if (formData.get("name") === "") {
    return { error: { message: "Preencha o campo 'Nome'" } };
  }

  if (formData.get("slug") === "") {
    return { error: { message: "Preencha o campo 'Slug'" } };
  }

  if (formData.getAll("users").length === 0) {
    return { error: { message: "Escolha pelo menos uma pessoa" } };
  }

  const values = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    short: formData.get("short") as string,
    users: formData.getAll("users") as string[],
  };

  const { data, error } = await supabase
    .from("Account")
    .insert(values)
    .select("*")
    .single();

  return { data, error };
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { data: persons } = await getPersons(request, context);
  return { persons };
};

export default function NewAccount() {
  const { persons } = useLoaderData<{ persons: PersonModel[] }>();
  const matches = useMatches();
  const { person } = matches[1].data;

  const actionData = useActionData<{
    data?: any;
    error?: { message: string };
  }>();

  return (
    <div className="h-full max-w-md flex-grow border-l p-4 dark:border-gray-800 md:w-1/2 lg:px-8">
      <h4 className="mb-4">Novo cliente</h4>
      {actionData?.error && (
        <Exclamation type="error">{actionData.error.message}</Exclamation>
      )}
      <Form method="post" className="mt-4">
        <InputField
          name="name"
          label="Nome"
          onChange={(event) => {
            const slug = document.querySelector(
              "input[name='slug']"
            ) as HTMLInputElement;
            const abv = document.querySelector(
              "input[name='short']"
            ) as HTMLInputElement;

            slug.value = event.target.value
              .replace(/\s/g, "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            abv.value = event.target.value
              .replace(" ", "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .substring(0, 4);
          }}
        />
        <InputField name="slug" label="Slug" />
        <InputField name="short" label="Abreviação" />
        <div className="field-label">Quem pode ter acesso</div>
        <div>
          {persons.map((p) => (
            <CheckboxField
              name="users"
              label={p.name}
              value={p.user.id}
              key={p.user.id}
              checked={p.user.id === person.user.id}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Button type="submit" primary>
            Adicionar
          </Button>
        </div>
      </Form>
    </div>
  );
}
