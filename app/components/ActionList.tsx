import type { ActionModel } from "~/lib/models";
import { ActionMedium } from "./Actions";
import Exclamation from "./Exclamation";
import Scrollable from "./Scrollable";

export default function ActionList({
  actions,
  hideAccount,
  showDateAndTime,
  className,
  wrap,
  warn,
}: {
  actions: ActionModel[];
  hideAccount?: boolean;
  showDateAndTime?: boolean;
  className?: string;
  wrap?: boolean;
  warn?: boolean;
}) {
  return actions && actions.length > 0 ? (
    <Scrollable skinnyThumb>
      <div className={`h-full w-full ${className ?? ""}`}>
        {actions.map((action, i) => (
          <ActionMedium
            action={action}
            key={i}
            hideAccount={hideAccount}
            showDateAndTime={showDateAndTime}
            wrap={wrap}
          />
        ))}
      </div>
    </Scrollable>
  ) : warn ? (
    <Exclamation icon>Nenhuma ação para exibir.</Exclamation>
  ) : null;
}
