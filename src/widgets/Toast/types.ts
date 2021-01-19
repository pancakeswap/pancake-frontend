export enum AlertType {
  SUCCESS = "success",
  DANGER = "danger",
  WARNING = "warning",
  INFO = "info",
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description?: string;
}

export interface ToastContainerProps {
  alerts: Alert[];
  stackSpacing?: number;
  ttl?: number;
  onRemove: (id: string) => void;
}

export interface ToastProps {
  alert: Alert;
  onRemove: ToastContainerProps["onRemove"];
  ttl: number;
  style: Partial<CSSStyleDeclaration>;
}
