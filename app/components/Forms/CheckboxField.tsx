import { Check } from "lucide-react";

export default function CheckboxField({
  name,
  label,
  checked = false,
  value = "true",
}: {
  name: string;
  label: string;
  checked?: boolean;
  value?: string;
}) {
  return (
    <label className="field field-checkbox">
      <input
        name={name}
        type="checkbox"
        defaultChecked={checked}
        value={value}
      />
      <div className="checkbox">
        <Check className="m-0 w-4" />
      </div>
      <span className="field-label">{label}</span>
    </label>
  );
}
