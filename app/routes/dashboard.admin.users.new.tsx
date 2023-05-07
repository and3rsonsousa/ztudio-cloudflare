import type { ActionFunction } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import Exclamation from "~/components/Exclamation";
import Button from "~/components/Button";
import InputField from "~/components/Forms/InputField";
import { getSupabase } from "~/lib/supabase";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { supabase } = getSupabase(request);

  if (formData.get("name") === "") {
    return { error: { message: "Preencha o campo 'Nome'" } };
  }

  if (formData.get("email") === "") {
    return { error: { message: "Preencha o campo 'Slug'" } };
  }

  if (formData.get("password") === "") {
    return { error: { message: "Preencha o campo 'Slug'" } };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({ email, password });

  if (!error) {
    const { data, error } = await supabase
      .from("Person")
      .insert({ name, email, user: user?.id, user_id: user?.id });

    return { data, error };
  } else {
    return { error };
  }
};

export default function NewUser() {
  const actionData = useActionData<{
    data?: any;
    error?: { message: string };
  }>();

  return (
    <div className="h-full w-1/2 max-w-md border-l p-4 dark:border-gray-800 lg:px-8">
      <h4 className="mb-4">Novo Usuário</h4>
      {actionData?.error && (
        <Exclamation type="error">{actionData.error.message}</Exclamation>
      )}
      <Form method="post" className="mt-4">
        <InputField name="name" label="Nome" />
        <InputField name="email" label="E-mail" type="email" />
        <InputField name="password" label="Senha" />

        <div className="flex justify-end">
          <Button type="submit" primary>
            Adicionar
          </Button>
        </div>
      </Form>
    </div>
  );
}
