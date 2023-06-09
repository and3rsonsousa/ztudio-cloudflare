import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import type { ContextType } from "~/lib/models";
import Button from "../Button";
import Exclamation from "../Exclamation";
import Checkbox from "../Forms/CheckboxField";
import Field from "../Forms/InputField";
import Loader from "../Loader";
import HeaderDialog from "./HeaderDialog";

export default function CelebrationDialog({
  context,
}: {
  context: ContextType;
}) {
  const date = context.date.day;
  const fetcher = useFetcher();
  const isAdding =
    fetcher.state === "submitting" &&
    fetcher.formData.get("action") === "create-celebration";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (
      !isAdding &&
      fetcher.state === "idle" &&
      fetcher.data &&
      !fetcher.data.error
    ) {
      context.celebrations?.set(false);
    }
  }, [isAdding, context, fetcher]);

  return (
    <>
      <HeaderDialog {...{isAdding}} label="Celebração" />
      {fetcher.data && fetcher.data.error ? (
        <Exclamation type="error" icon>
          {fetcher.data.error.message}
        </Exclamation>
      ) : null}

      <fetcher.Form method="post" ref={formRef} action="/handle-action">
        <input type="hidden" name="action" value="create-celebration" />
        <Field name="name" label="Nome" />
        <Field
          name="date"
          label="Data"
          pattern="[0-9]{2}/[0-9]{2}"
          value={date.format("DD/MM")}
          placeholder="dd/mm"
        />
        <Checkbox label="Feriado" name="is_holiday" />
        <div className="flex items-center justify-end pt-4">
          <Button primary type="submit">
            Adicionar
          </Button>
        </div>
      </fetcher.Form>
    </>
  );
}
