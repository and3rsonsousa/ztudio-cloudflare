import { useState } from "react";

export default function ZSwitch({
  name,
  defaultChecked,
  label,
  labels,
  value = "true",
}: {
  name: string;
  defaultChecked?: boolean;
  label?: string;
  labels?: string[];
  value?: string;
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <div className="field">
      {label && <div className="field-label">{label}</div>}
      <label className="field field-checkbox">
        <input
          type="checkbox"
          name={name}
          className="checkbox"
          value={value}
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <div className="switch">
          <div className="switch-handle"></div>
        </div>
        {labels && (
          <span className="field-label">{labels[checked ? 1 : 0]}</span>
        )}
      </label>
    </div>
  );
}
