import { Check } from "lucide-react";

export default function CheckboxField({
  name,
  label,
  checked = false,
  value = "true",
  onChange,
}: {
  name: string;
  label: string;
  checked?: boolean;
  value?: string;
  onChange?: () => void;
}) {
  return (
    <label className="field field-checkbox" htmlFor={name}>
      <input
        name={name}
        id={name}
        type="checkbox"
        defaultChecked={checked}
        onChange={onChange}
        value={value}
      />
      <div className="checkbox">
        <Check className="m-0 w-4" />
      </div>
      <span className="field-label">{label}</span>
    </label>
  );
}
