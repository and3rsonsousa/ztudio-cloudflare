import { useRef } from "react";

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
  const inputRef = useRef(null);
  // const [content, setContent] = useState(value);

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
        }}
        rows={rows}
        ref={inputRef}
        className={`field-default`}
      />
      {/* <input
        name={name}
        type="hidden"
        placeholder={placeholder}
        value={content}
        required={required}
        // rows={rows}
        ref={inputRef}
        className={`field-default`}
      /> */}
      {/* <div
        contentEditable={true}
        className={`field-default`}
        onInput={(e) => {
          setContent(e.currentTarget.innerHTML);
          if (onChange) onChange(content as string);
        }}
        dangerouslySetInnerHTML={{ __html: value ?? "" }}
      /> */}
    </div>
  );
}
