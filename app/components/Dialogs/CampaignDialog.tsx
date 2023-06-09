import {
  Form,
  useFetcher,
  useMatches,
  useSearchParams,
} from "@remix-run/react";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import type {
  AccountModel,
  CampaignModel,
  ContextType,
  ItemModel,
  PersonModel,
} from "~/lib/models";
import Button from "../Button";
import Exclamation from "../Exclamation";
import DateRangeField from "../Forms/DateRangeField";
import { default as Field } from "../Forms/InputField";
import SelectField from "../Forms/SelectField";
import TextareaField from "../Forms/TextareaField";
import HeaderDialog from "./HeaderDialog";

export default function CampaignDialog({
  campaign,
  context,
}: {
  campaign?: CampaignModel;
  context: ContextType;
}) {
  const fetcher = useFetcher();
  const matches = useMatches();
  const [searchParams] = useSearchParams();

  const date = context.date.day;

  const accounts: AccountModel[] = matches[1].data.accounts;
  const stages: ItemModel[] = matches[1].data.stages;
  const creator: PersonModel = matches[1].data.person;
  const account: AccountModel = campaign
    ? campaign.account
    : matches[2].data.account;

  const accountItems = accounts.map((account) => ({
    label: account.name,
    value: account.id,
  }));
  const stageItems = stages.map((stage) => ({
    label: stage.name,
    value: stage.id,
  }));

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
      context.campaigns?.set(false);
    }
  }, [isAdding, context, fetcher]);

  return (
    <>
      <HeaderDialog
        {...{ isAdding, account }}
        item={campaign}
        label="Campanha"
      />

      {fetcher.data && fetcher.data.error ? (
        <Exclamation type="error" icon>
          {fetcher.data.error.message}
        </Exclamation>
      ) : null}

      <fetcher.Form
        method="post"
        ref={formRef}
        action={
          campaign
            ? `./${
                searchParams.get("redirectTo") !== null
                  ? "?redirectTo=".concat(
                      searchParams.get("redirectTo") as string
                    )
                  : ""
              }`
            : "/handle-action"
        }
      >
        <input
          type="hidden"
          name="action"
          value={campaign ? "update-campaign" : "create-campaign"}
        />

        {campaign ? (
          <input type="hidden" name="id" value={campaign.id} />
        ) : (
          <input type="hidden" name="creator" value={creator.id} />
        )}
        <Field
          name="name"
          label="Nome"
          value={campaign ? campaign.name : undefined}
        />
        {campaign || account ? (
          <input type="hidden" name="account" value={account.id} />
        ) : (
          <SelectField name="account" label="Cliente" items={accountItems} />
        )}
        <TextareaField
          name="description"
          label="Descrição"
          rows={3}
          value={campaign ? campaign.description : undefined}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <DateRangeField
            names={["date_start", "date_end"]}
            label="Período"
            full
            day1={campaign ? dayjs(campaign.date_start) : date}
            day2={campaign ? dayjs(campaign.date_end) : date.add(5, "days")}
          />

          <SelectField
            name="stage"
            label="Status"
            items={stageItems}
            value={campaign ? campaign.stage : undefined}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          {campaign && (
            <Form method="post">
              <input type="hidden" name="id" value={campaign.id} />
              <input type="hidden" name="action" value="delete-campaign" />
              <Button>Excluir</Button>
            </Form>
          )}
          <Button primary type="submit">
            {campaign ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </fetcher.Form>
    </>
  );
}
