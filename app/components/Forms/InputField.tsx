import dayjs from "dayjs";
import type { ChangeEvent } from "react";

export default function InputField(props: {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "datetime-local";
  placeholder?: string;
  value?: string;
  pattern?: string;
  required?: boolean;
  disabled?: boolean;
  preffix?: React.ReactNode;
  suffix?: React.ReactNode;
  isTextarea?: boolean;
  onChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}) {
  const defaultValue =
    props.type === "datetime-local"
      ? dayjs(props.value).format("YYYY-MM-DD[T]HH:mm")
      : props.value;

  return (
    <div className="field">
      <label>
        <div className="field-label">{props.label}</div>

        <div className={`field-input flex h-12 items-center overflow-hidden`}>
          {props.preffix}

          <input
            className={`w-full bg-transparent py-3 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
              props.preffix !== undefined ? "pl-2" : "pl-5"
            } ${props.suffix !== undefined ? "pr-2" : "pr-5"}`}
            defaultValue={defaultValue}
            required={props.required}
            placeholder={props.placeholder ?? props.label}
            disabled={props.disabled}
            type={props.type}
            name={props.name}
            onChange={(event) => {
              if (props.onChange) props.onChange(event);
            }}
          />

          {props.suffix}
        </div>
      </label>
    </div>
  );
}
