import * as ContextMenu from "@radix-ui/react-context-menu";
import { useFetcher, useMatches, useNavigate } from "@remix-run/react";
import dayjs from "dayjs";
import { CheckCircle, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CampaignModel, ItemModel } from "~/lib/models";

export function Campaign({ campaign }: { campaign: CampaignModel }) {
  const matches = useMatches();
  const fetcher = useFetcher();
  const account = matches[2].data.account;
  const url = matches[1].data.url;

  return (
    <div className="group flex justify-between gap-4">
      <div>
        <div className="text-lg font-semibold">{campaign.name}</div>
        <div className="mt-1 text-xs tracking-wide">
          {dayjs(campaign.date_start).isBefore(dayjs())
            ? "Começou no dia"
            : "Começa no dia"}
          <strong className="font-semibold">
            {dayjs(campaign.date_start).format(" D [de] MMMM [de] YYYY ")}
          </strong>
          {dayjs(campaign.date_end).isBefore(dayjs())
            ? "e terminou no dia"
            : "e terminará no dia"}

          <strong className="font-semibold">
            {dayjs(campaign.date_end).format(" D [de] MMMM [de] YYYY")}
          </strong>
        </div>
        <div className="mt-2 text-sm">
          {campaign.actions !== null ? "" : "Nenuma ação nessa campanha"}
        </div>
      </div>
      <div className="flex gap-2 opacity-0  group-hover:opacity-100">
        <div>
          <Link
            to={`/dashboard/${account.slug}/campaign/${campaign.id}/?redirectTo=${url}`}
            className="button"
          >
            <Edit />
          </Link>
        </div>
        <div>
          <button
            className="button"
            onClick={() => {
              fetcher.submit(
                {
                  id: campaign.id,
                  action: "delete-campaign",
                },
                {
                  method: "post",
                  action: "/handle-action",
                }
              );
            }}
          >
            <Trash2 />
          </button>
        </div>
      </div>
    </div>
  );
}

export const CampaignLine = ({ campaign }: { campaign: CampaignModel }) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const matches = useMatches();
  const stages: ItemModel[] = matches[1].data.stages;
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div
          onClick={() =>
            navigate(
              `/dashboard/${campaign.Account?.slug}/campaign/${campaign.id}`
            )
          }
          className={`cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap bg-gray-100 py-1 px-2 text-xs font-medium  bg-${campaign.Stage?.slug} bg-${campaign.Stage?.slug}-hover `}
        >
          {campaign.name} {dayjs(campaign.date_end).format("DD/MM/YYYY")}
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="dropdown-content">
          <ContextMenu.Item asChild>
            <Link
              to={`/dashboard/${campaign.Account?.slug}/campaign/${campaign.id}`}
              className="dropdown-item item-small "
            >
              <Edit className="sq-4" /> <div>Editar</div>
            </Link>
          </ContextMenu.Item>
          <ContextMenu.Item
            className="dropdown-item item-small "
            onSelect={() => {
              fetcher.submit(
                {
                  id: campaign.id,
                  action: "delete-campaign",
                },
                {
                  method: "post",
                  action: "/handle-action",
                }
              );
            }}
          >
            <Trash2 className="sq-4" /> <div>Excluir</div>
          </ContextMenu.Item>
          <hr className="dropdown-hr" />
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="dropdown-item item-small ">
              <CheckCircle className="sq-4" />
              <div className="flex flex-auto justify-between gap-4">
                <div>Status</div>

                <div className="">
                  <ChevronRight className="sq-4" />
                </div>
              </div>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className="dropdown-content min-w-[9rem]">
                {stages.map((stage) => (
                  <ContextMenu.Item
                    key={stage.id}
                    onSelect={(event) => {
                      fetcher.submit(
                        {
                          action: "update-campaign-stage",
                          id: campaign.id,
                          stage: stage.id,
                        },
                        {
                          method: "post",
                          action: "/handle-action",
                        }
                      );
                    }}
                    className="dropdown-item item-small "
                  >
                    <div
                      className={`h-2 w-2 rounded-full bg-${stage.slug}`}
                    ></div>
                    <div className="flex-shrink-0 flex-grow">{stage.name}</div>
                    {campaign.stage === stage.id && (
                      <CheckCircle className="sq-4" />
                    )}
                  </ContextMenu.Item>
                ))}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};
