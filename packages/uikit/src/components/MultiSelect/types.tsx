import { SelectItem } from "primereact/selectitem";
import { MultiSelectProps } from "primereact/multiselect";

export interface IMultiSelectChangeEvent<T extends string | number = string> {
  value: T[];
  target?: ISelectItem<T>;
  stopPropagation(): void;
  preventDefault(): void;
  originalEvent?: React.SyntheticEvent;
}

export interface ISelectItem<T extends string | number> extends SelectItem {
  icon?: string | JSX.Element;
  value: T;
  label: string;
  [k: string]: any;
}

export type IOptionType<T extends string | number> = ISelectItem<T>[];

export interface IMultiSelectProps<T extends string | number> extends Omit<MultiSelectProps, "onChange"> {
  value?: T[];
  style?: React.CSSProperties;
  panelStyle?: React.CSSProperties;
  scrollHeight?: string;
  options?: IOptionType<T>;
  placeholder?: string;
  isShowFilter?: boolean;
  isShowSelectAll?: boolean;
  onChange?: (e: IMultiSelectChangeEvent<T>) => void;
}
