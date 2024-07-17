import { SelectItem } from "primereact/selectitem";
import { MultiSelectProps, MultiSelectChangeEvent } from "primereact/multiselect";

export type { MultiSelectChangeEvent };

export interface ISelectItem<T extends string | number> extends SelectItem {
  icon?: string | JSX.Element;
  value: T;
  label: string;
  [k: string]: any;
}

export type IOptionType<T extends string | number> = ISelectItem<T>[];

export interface IMultiSelectProps<T extends string | number> extends MultiSelectProps {
  style?: React.CSSProperties;
  panelStyle?: React.CSSProperties;
  scrollHeight?: string;
  options?: IOptionType<T>;
  placeholder?: string;
  isShowFilter?: boolean;
  isShowSelectAll?: boolean;
}
