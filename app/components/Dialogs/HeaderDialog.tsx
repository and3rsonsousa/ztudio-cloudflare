import dayjs from "dayjs";
import type { AccountModel, ActionModel, CampaignModel, CelebrationModel } from "~/lib/models";
import Loader from "../Loader";
import { useParams } from "@remix-run/react";

export default function HeaderDialog ({label, item, account, isUpdating, isAdding}:{label:string, item?: ActionModel | CampaignModel | CelebrationModel, account?: AccountModel, isUpdating?:boolean, isAdding: boolean}) {
  const params = useParams()
  console.log({params});
  
  return <div className="mb-4 flex justify-between">
        <div>
          <h4 className="m-0 dark:text-gray-200">
            {item
              ? `Editar ${label}`
              : `Nova ${label}`}
          </h4>
          {account && !params.id ?
          <h6 >{ account.name }</h6> : null}
          {item && (
            <div className="mt-1 text-xs font-normal text-gray-300 dark:text-gray-700">
              #{item.id}
            </div>
          )}
        </div>

        {/* Mostra há quanto tempo foi criado ou atualizado */}
        {item ? (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div>{isUpdating ? <Loader size="small" /> : null}</div>
            <div>
              {dayjs(item.created_at).format("YYYY-MM-dd HH:mm:ss") ===
              dayjs(item.updated_at).format("YYYY-MM-dd HH:mm:ss")
                ? "Criado "
                : "Atualizado "}

              {dayjs(item.updated_at).fromNow()}
            </div>
          </div>
        ) : (
          isAdding && <Loader />
        )}
      </div>
}