import { ReactNode } from "react";

export const types = {
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
  INFO: "info",
};

export type Types = (typeof types)[keyof typeof types];

export interface ToastData {
  id: string | number;
  type: Types;
  title: string;
  description?: ReactNode;
}

export interface ToastProps {
  toast: ToastData;
  onRemove: (id: string | number) => void;
}
