import { SelectItem } from "primereact/selectitem";
import { MultiSelectProps } from "primereact/multiselect";

export interface ISelectItem extends SelectItem {
  icon?: string;
  value: string;
  label: string;
}

export type IOptionType = ISelectItem[];

export interface IMultiSelectProps extends MultiSelectProps {
  style?: React.CSSProperties;
  panelStyle?: React.CSSProperties;
  scrollHeight?: string;
  options?: IOptionType;
  placeholder?: string;
  defaultValue?: string[];
  isFilter?: boolean;
  isSelectAll?: boolean;
}
