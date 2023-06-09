import {
  Form,
  useFetcher,
  useMatches,
  useSearchParams
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type {
  AccountModel,
  ActionModel,
  CampaignModel,
  ContextType,
  ItemModel,
  PersonModel,
} from "~/lib/models";
import Button from "../Button";
import Exclamation from "../Exclamation";
import { default as Field, default as InputField } from "../Forms/InputField";
import SelectField from "../Forms/SelectField";
import TextareaField from "../Forms/TextareaField";
import Loader from "../Loader";

import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import CheckboxField from "../Forms/CheckboxField";
import HeaderDialog from "./HeaderDialog";


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("pt-br");
dayjs.tz.setDefault("America/Fortaleza");

export default function ActionDialog({
  action,
  context,
}: {
  date?: Dayjs;
  action?: ActionModel;
  context: ContextType;
}) {
  const matches = useMatches();
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const [searchParams] = useSearchParams();

  // const context: ContextType = useOutletContext();

  const date = context.date.day;

  const accounts: AccountModel[] = matches[1].data.accounts;
  const categories: ItemModel[] = matches[1].data.categories;
  const stages: ItemModel[] = matches[1].data.stages;
  // const attributes: ItemModel[] = matches[1].data.attributes;
  const persons: PersonModel[] = matches[1].data.persons;
  const campaigns: CampaignModel[] =
    matches[2].data.campaigns ?? matches[3].data.campaigns;

  const creator: PersonModel = action ? action.creator : matches[1].data.person;
  const account: AccountModel = action
    ? action.account
    : matches[2].data.account;

  const accountItems = accounts.map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [selectedAccount, setSelectedAccount] = useState(
    account ? account.id : ""
  );
  const [isDirty, setDirty] = useState(false);

  const campaignItems =
    selectedAccount && campaigns
      ? campaigns
          .filter((campaign) => campaign.account === selectedAccount)
          .map((campaign) => ({
            label: campaign.name,
            value: campaign.id,
          }))
      : [];

  const isAdding =
    fetcher.state === "submitting" &&
    fetcher.formData.get("action") === "create-action";

  const isUpdating =
    fetcher.state === "submitting" &&
    fetcher.formData.get("action") === "update-action";

  useEffect(() => {
    if (
      !isAdding &&
      fetcher.state === "idle" &&
      fetcher.data &&
      !fetcher.data.error
    ) {
      context.actions.set(false);
    }
  }, [isAdding, context, fetcher]);

  useEffect(() => {
    function getDirty() {
      setDirty(true);
    }

    window.addEventListener("keydown", getDirty);
    window.addEventListener("mousedown", getDirty);

    if (action) {
      const save = setInterval(() => {
        if (isDirty) {
          fetcher.submit(formRef.current, {
            method: "post",
            action: `/handle-action`,
          });
          setDirty(false);
        }
      }, 5000);
      return () => {
        clearInterval(save);
        window.removeEventListener("keydown", getDirty);
        window.removeEventListener("mousedown", getDirty);
      };
    }
  }, [action, isDirty, fetcher]);
  return (
    <>
      
        <HeaderDialog {...{isAdding, account, isUpdating}} item={action} label="Ação" />

      {fetcher.data && fetcher.data.error ? (
        <Exclamation type="error" icon>
          {fetcher.data.error.message}
        </Exclamation>
      ) : null}

      <fetcher.Form
        method="post"
        ref={formRef}
        action={
          action
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
        <input type="hidden" name="redirectTo" />
        <input
          type="hidden"
          name="action"
          value={action ? "update-action" : "create-action"}
        />
        <input type="hidden" name="creator" value={creator.id} />
        {action ? <input type="hidden" name="id" value={action.id} /> : null}

        <Field
          name="name"
          label="Nome"
          placeholder="Nome a Ação"
          value={action ? action.name : undefined}
        />

        <div className="grid-cols-2 gap-4 md:grid">
          <SelectField
            name="account"
            label="Cliente"
            items={accountItems}
            value={
              action ? action.account.id : account ? account.id : undefined
            }
            onChange={setSelectedAccount}
          />

          {matches[3] && matches[3].data.campaign ? (
            <input
              type="hidden"
              name="campaign"
              value={matches[3].data.campaign.id}
            />
          ) : (
            <SelectField
              name="campaign"
              label="Campanha"
              items={campaignItems}
              placeholder={
                selectedAccount
                  ? campaignItems?.length > 0
                    ? "Selecione uma campanha"
                    : "Nenhum campanha para esse cliente"
                  : "Escolha um cliente primeiro"
              }
              disabled={campaignItems?.length === 0}
              value={action && action.campaign ? action.campaign.id : undefined}
            />
          )}
        </div>

        <TextareaField
          name="description"
          label="Descrição"
          value={action ? action.description : undefined}
          rows={action ? 5 : 3}
        />

        <div className="grid-cols-2 gap-4 md:grid">
          <SelectField
            name="category"
            label="Categoria"
            value={
              action
                ? action.category.id
                : "d90224a7-abf2-4bc7-be60-e5d165a6a37a"
            }
            items={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          <SelectField
            name="stage"
            label="Status"
            value={
              action ? action.stage.id : "32a26e75-5f4a-4ae7-8805-877909abb477"
            }
            items={stages.map((stage) => ({
              label: stage.name,
              value: stage.id,
            }))}
          />

          <InputField
            name="date"
            label="Data"
            type="datetime-local"
            value={
              action
                ? action.date
                : date
                ? date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
                  ? parseInt(dayjs().format("HH")) >= 10
                    ? dayjs().add(1, "hour").format("YYYY-MM-DD[T]HH:mm:ss")
                    : date.format("YYYY-MM-DD[T11:12:00]")
                  : date.format("YYYY-MM-DD[T11:12:00]")
                : undefined
            }
          />

          <div className="field">
            <div className="field-label">Responsáveis</div>

            {persons.map((person) => (
              <CheckboxField
                key={person.id}
                name="responsibles"
                value={person.id}
                label={person.name}
                checked={
                  action
                    ? action.responsibles?.filter((user) => user === person.id)
                        .length > 0
                    : creator.id === person.id
                }
              />
            ))}
          </div>

          {/* <SelectField
            name="responsible"
            label="Responsáveis"
            items={personsItems}
            value={action ? action.responsible.id : creator.id}
          /> */}
        </div>

        <div className={`h-16`}>
          <div className={`flex w-full items-center justify-end gap-2 py-4 `}>
            {action && (
              <>
                {action.deleted && (
                  <>
                    <div className="text-xs font-bold text-error-500">
                      Este item está na lixeira
                    </div>
                    <Form method="post">
                      <input type="hidden" name="id" value={action.id} />
                      <input
                        type="hidden"
                        name="action"
                        value="update-action-restore"
                      />

                      <Button type="submit" primary>
                        Restaurar
                      </Button>
                    </Form>
                  </>
                )}
                <Form method="post">
                  <input type="hidden" name="id" value={action.id} />
                  <input
                    type="hidden"
                    name="action"
                    value={
                      action.deleted ? "delete-action-trash" : `delete-action`
                    }
                  />

                  <Button type="submit">
                    {action.deleted ? "Excluir" : "Lixeira"}
                  </Button>
                </Form>
              </>
            )}
            <Button
              primary={!action?.deleted}
              type="submit"
              loading={isAdding || isUpdating}
            >
              {action ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </div>
      </fetcher.Form>
    </>
  );
}
