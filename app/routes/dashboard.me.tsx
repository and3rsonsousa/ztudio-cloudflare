import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { type AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import Button from "~/components/Button";
import Exclamation from "~/components/Exclamation";
import InputField from "~/components/Forms/InputField";
import ZRadioGroup from "~/components/Forms/zRadioGroup";
import ZSwitch from "~/components/Forms/zSwitch";
import Scrollable from "~/components/Scrollable";
import { getUser } from "~/lib/auth.server";
import { VIEWS } from "~/lib/constants";
import { getPersonByUser, handleAction } from "~/lib/data";
import type { ContextType, PersonModel } from "~/lib/models";
import { getSupabase } from "~/lib/supabase";

export const loader: LoaderFunction = async ({ request, context }) => {
  const {
    data: { session },
    response,
  } = await getUser(request, context);

  if (session === null) {
    return redirect(`/login`, { headers: response.headers });
  }

  const { data: person } = await getPersonByUser(
    session.user.id,
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

export default function Me() {
  const { person } = useLoaderData<{ person: PersonModel }>();
  const { supabase } = useOutletContext<ContextType>();
  const [error, setError] = useState<AuthError | null>(null);

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b p-4 dark:border-gray-800">
        <Link to={`/me`}>
          <h2 className="mb-0 text-center dark:text-gray-200">Minha conta</h2>
        </Link>
      </div>
      <Scrollable skinnyThumb>
        <div className="mx-auto h-full max-w-md p-4">
          <Form method="post">
            <input type="hidden" name="action" value="update-person" />
            <input type="hidden" name="id" value={person.id} />
            <InputField label="Nome" name="name" value={person.name} />
            <InputField label="Email" name="email" value={person.email} />

            <hr className="dropdown-hr" />

            <div className="mb-2">
              <h5>Configurações padrões</h5>
            </div>

            <ZRadioGroup
              name="config_view"
              label="View"
              items={VIEWS}
              column={2}
              defaultValue={person.config_view}
            />
            <ZRadioGroup
              name="config_order"
              label="Ordem"
              items={[
                { label: "Status", value: "status" },
                { label: "Data", value: "date" },
              ]}
              defaultValue={person.config_order}
            />
            <ZRadioGroup
              name="config_show"
              label="Organizar"
              items={[
                { label: "Mostrar todos", value: "arrange_all" },
                { label: "Por categoria", value: "arrange_category" },
                { label: "Por cliente", value: "arrange_account" },
              ]}
              defaultValue={person.config_show}
            />
            <ZSwitch
              label="Sidebar"
              name="config_sidebar"
              labels={["Ocultar Sidebar", "Expandir Sidebar"]}
              defaultChecked={person.config_sidebar === "true"}
            />

            <div className="flex justify-end">
              <Button primary type="submit">
                Atualizar
              </Button>
            </div>
          </Form>
          <hr className="my-8 border-gray-800" />

          <div className="mb-4">
            <Exclamation type="alert">Not working yet</Exclamation>
          </div>

          <div className="field">
            <label>
              <div className="field-label">Senha</div>
            </label>
            <button
              className="link text-brand"
              onClick={async () => {
                const { error } = await supabase.auth.resetPasswordForEmail(
                  person.email,
                  {
                    redirectTo: `${location.host}/reset-password`,
                  }
                );
                setError(error);
              }}
            >
              Clique aqui
            </button>{" "}
            para redefinir a sua Senha
          </div>

          {error ? (
            <Exclamation type="error">{error.message}</Exclamation>
          ) : null}
        </div>
      </Scrollable>
    </div>
  );
}
