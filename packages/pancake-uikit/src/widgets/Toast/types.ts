import { ReactNode } from "react";

export const types = {
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
  INFO: "info",
};

export type Types = typeof types[keyof typeof types];

export interface Toast {
  id: string;
  type: Types;
  title: string;
  description?: ReactNode;
}

export interface ToastContainerProps {
  toasts: Toast[];
  stackSpacing?: number;
  ttl?: number;
  onRemove: (id: string) => void;
}

export interface ToastProps {
  toast: Toast;
  onRemove: ToastContainerProps["onRemove"];
  ttl: number;
  style: Partial<CSSStyleDeclaration>;
}
