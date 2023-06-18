import { Check } from "lucide-react";
import { type FormItemModel } from "./SelectField";

export default function ZRadioGroup({
  items,
  label,
  defaultValue,
  name,
  column,
}: {
  items: FormItemModel[];
  label?: string;
  name: string;
  defaultValue?: string;
  column?: 2 | 3;
}) {
  return (
    <div className="field">
      {label && <div className="field-label">{label}</div>}
      <div
        className={
          column
            ? `grid gap-x-4 ${column === 2 ? "grid-cols-2" : "grid-cols-3"}`
            : ""
        }
      >
        {items.map((item, i) => (
          <label className="field field-checkbox" key={i}>
            <input
              type="radio"
              value={item.value}
              name={name}
              defaultChecked={item.value === defaultValue}
            />
            <div className="checkbox">
              <Check className="m-0 w-4" />
            </div>
            <span className="field-label">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
