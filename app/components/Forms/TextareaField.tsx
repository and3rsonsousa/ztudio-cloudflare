import { useEffect, useRef } from "react";

export default function TextareaField({
  label,
  name,
  placeholder,
  rows,
  value,
  required,
  onChange,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  pattern?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fixHeight();
  }, []);

  function fixHeight() {
    if (textareaRef.current?.scrollHeight) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
    }
  }

  return (
    <div className="field">
      <label className="field-label">{label}</label>

      <textarea
        name={name}
        placeholder={placeholder}
        defaultValue={value}
        required={required}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
          fixHeight();
        }}
        ref={textareaRef}
        className={`field-default overflow-y-hidden`}
      />
    </div>
  );
}
