import {
  Form,
  useFetcher,
  useMatches,
  useOutletContext,
  useSearchParams,
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
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("pt-br");
dayjs.tz.setDefault("America/Fortaleza");

export default function ActionDialog({
  action,
}: {
  date?: Dayjs;
  action?: ActionModel;
}) {
  const matches = useMatches();
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const [searchParams] = useSearchParams();

  const context: ContextType = useOutletContext();

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
    title: account.name,
    value: account.id,
  }));

  const personsItems = persons.map((person) => ({
    title: person.name,
    value: person.id,
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
            title: campaign.name,
            value: campaign.id,
          }))
      : [];

  const isAdding =
    fetcher.state === "submitting" &&
    fetcher.submission.formData.get("action") === "create-action";

  const isUpdating =
    fetcher.state === "submitting" &&
    fetcher.submission.formData.get("action") === "update-action";

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
      <div className="mb-4 flex justify-between">
        <div>
          <h4 className="m-0 dark:text-gray-200">
            {action
              ? `Editar Ação`
              : `Nova Ação${account ? " para ".concat(account.name) : ""}`}
          </h4>
          {action && (
            <div className="mt-1 text-xs font-normal text-gray-300 dark:text-gray-700">
              #{action.id}
            </div>
          )}
        </div>

        {/* Mostra há quanto tempo foi criado ou atualizado */}
        {action ? (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div>{isUpdating ? <Loader size="small" /> : null}</div>
            <div>
              {dayjs(action.created_at).format("YYYY-MM-dd HH:mm:ss") ===
              dayjs(action.updated_at).format("YYYY-MM-dd HH:mm:ss")
                ? "Criado "
                : "Atualizado "}

              {dayjs(action.updated_at).fromNow()}
            </div>
          </div>
        ) : (
          isAdding && <Loader />
        )}
      </div>

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

        <div className="flex gap-4">
          <div className="w-full flex-auto md:w-1/2">
            <SelectField
              name="account"
              title="Cliente"
              items={accountItems}
              value={
                action ? action.account.id : account ? account.id : undefined
              }
              onChange={setSelectedAccount}
            />
          </div>
          <div className="w-full flex-auto md:w-1/2">
            {matches[3] && matches[3].data.campaign ? (
              <input
                type="hidden"
                name="campaign"
                value={matches[3].data.campaign.id}
              />
            ) : (
              <SelectField
                name="campaign"
                title="Campanha"
                items={campaignItems}
                placeholder={
                  selectedAccount
                    ? campaignItems?.length > 0
                      ? "Selecione uma campanha"
                      : "Nenhum campanha para esse cliente"
                    : "Escolha um cliente primeiro"
                }
                disabled={campaignItems?.length === 0}
                value={
                  action && action.campaign ? action.campaign.id : undefined
                }
              />
            )}
          </div>
        </div>

        <TextareaField
          name="description"
          label="Descrição"
          value={action ? action.description : undefined}
          rows={action ? 5 : 3}
        />

        <div className="grid w-full gap-4 md:grid-cols-2">
          <SelectField
            name="category"
            title="Categoria"
            value={
              action
                ? action.category.id
                : "d90224a7-abf2-4bc7-be60-e5d165a6a37a"
            }
            items={categories.map((category) => ({
              title: category.name,
              value: category.id,
            }))}
          />

          <SelectField
            name="stage"
            title="Status"
            value={
              action ? action.stage.id : "32a26e75-5f4a-4ae7-8805-877909abb477"
            }
            items={stages.map((stage) => ({
              title: stage.name,
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

          <SelectField
            name="responsible"
            title="Responsável"
            items={personsItems}
            value={action ? action.responsible.id : creator.id}
          />
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
