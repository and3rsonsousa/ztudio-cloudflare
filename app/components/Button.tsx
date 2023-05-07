import React from "react";
import Loader from "./Loader";
import { Slot } from "@radix-ui/react-slot";

export default function Button(props: {
  children: React.ReactNode;
  small?: boolean;
  large?: boolean;
  squared?: boolean;
  primary?: boolean;
  disabled?: boolean;
  link?: boolean;
  icon?: boolean;
  title?: string;
  className?: string;
  type?: "submit" | "reset" | "button";
  loading?: boolean;
  isSuffix?: boolean;
  isPreffix?: boolean;
  asChild?: boolean;
  style?: {};
  onClick?: React.MouseEventHandler<HTMLButtonElement> &
    React.MouseEventHandler<HTMLElement>;
}) {
  const Component = props.asChild ? Slot : "button";

  return (
    <Component
      style={{ WebkitTapHighlightColor: "transparent", ...props.style }}
      className={`button ${props.primary ? "button-primary" : ""} ${
        props.small ? " button-small " : props.large ? "button-large" : ""
      } ${props.icon ? "button-icon" : ""} ${
        props.squared ? "button-squared" : ""
      } ${props.link ? "button-link" : ""} ${props.className ?? ""} ${
        props.isSuffix ? "h-12 rounded-r-none rounded-l-xl px-4" : ""
      } ${props.isPreffix ? "h-12 rounded-l-none rounded-r-xl px-4" : ""}`}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      title={props.title}
      aria-label={props.title}
      aria-disabled={props.disabled}
    >
      {props.loading ? <Loader /> : props.children}
    </Component>
  );
}
