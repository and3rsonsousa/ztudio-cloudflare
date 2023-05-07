import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { FolderTree } from "lucide-react";
import Button from "~/components/Button";
import { Campaign } from "~/components/Campaign";
import Exclamation from "~/components/Exclamation";
import { getCampaigns } from "~/lib/data";
import type { CampaignModel, ContextType } from "~/lib/models";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { data, error } = await getCampaigns({ request, account: params.slug });
  return { campaigns: data, error };
};

export default function CampaignsPage() {
  const { campaigns } = useLoaderData<{ campaigns: CampaignModel[] }>();
  const context: ContextType = useOutletContext();

  return (
    <div>
      <div className="flex items-center justify-between gap-2 border-b dark:border-gray-800">
        <h4 className="mb-0 p-4 first-letter:capitalize">
          Campanhas de Marketing
        </h4>
        <div className="pr-4">
          <Button
            primary
            small
            onClick={() => {
              context.campaigns.set(true);
            }}
          >
            <div>Nova Campanha</div>
            <FolderTree />
          </Button>
        </div>
      </div>

      <div className="divide-y">
        {campaigns.length ? (
          campaigns.map((campaign) => (
            <div key={campaign.id} className="p-4 lg:p-8">
              <Campaign campaign={campaign} />
            </div>
          ))
        ) : (
          <div className="p4 lg:p-8">
            <Exclamation icon>
              Esse cliente não tem nenhuma campanha.
            </Exclamation>
          </div>
        )}
      </div>
    </div>
  );
}
