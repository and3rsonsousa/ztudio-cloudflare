import { useOutletContext } from "@remix-run/react";
import {
  CalendarPlus,
  FilePlus2,
  Folder,
  FolderTree,
  Star,
} from "lucide-react";
import type { ContextType } from "~/lib/models";
import Button from "./Button";

export default function CreateButtons({
  celebration,
  campaign,
  action,
  showSmallAction,
}: {
  celebration?: boolean;
  campaign?: boolean;
  action?: boolean;
  showSmallAction?: boolean;
}) {
  const context: ContextType = useOutletContext();

  return (
    <div className="flex items-center justify-end gap-2 p-4 ">
      {/* Dialog for Celebrations */}
      {celebration && !showSmallAction && (
        <div>
          <Button
            link
            icon
            squared
            onClick={() => {
              context.celebrations.set(true);
            }}
          >
            <CalendarPlus />
          </Button>
        </div>
      )}
      {campaign && !showSmallAction && (
        <div>
          <Button
            link
            icon
            squared
            onClick={() => {
              context.campaigns.set(true);
            }}
          >
            <FolderTree />
          </Button>
        </div>
      )}
      {action && (
        <div
          className={`${
            showSmallAction ? "fixed right-4 bottom-4 z-10" : "ml-4"
          } `}
        >
          <Button
            primary
            icon
            squared={showSmallAction}
            large={showSmallAction}
            onClick={() => {
              context.actions.set(true);
            }}
            title="Cmd + Shift + K"
          >
            {!showSmallAction && (
              <div className="whitespace-nowrap">Nova Ação</div>
            )}
            <FilePlus2 />
          </Button>
        </div>
      )}
    </div>
  );
}
