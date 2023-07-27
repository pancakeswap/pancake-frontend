import { ReactNode } from "react";

export const types = {
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
  INFO: "info",
};

export type Types = (typeof types)[keyof typeof types];

export type StyledToastProps = "left" | "right" | "top" | "bottom" | undefined;

export interface ToastData {
  id: string;
  type: Types;
  title: string;
  description?: ReactNode;
  position?: StyledToastProps;
}

export interface ToastContainerProps {
  toasts: ToastData[];
  stackSpacing?: number;
  ttl?: number;
  onRemove: (id: string) => void;
}

export interface ToastProps {
  toast: ToastData;
  onRemove: ToastContainerProps["onRemove"];
  ttl: number;
  style: Partial<CSSStyleDeclaration>;
}
