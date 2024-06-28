import { MultiSelect, IOptionType } from "@pancakeswap/uikit";

export interface INetworkProps {
  data?: IOptionType;
}

export const NetworkSelect: React.FC<INetworkProps> = ({ data = [] }: INetworkProps) => {
  return (
    <MultiSelect
      style={{
        width: "273px",
        margin: "20px",
        backgroundColor: "var(--colors-input)",
      }}
      panelStyle={{
        backgroundColor: "var(--colors-input)",
      }}
      scrollHeight="400px"
      options={data}
      selectAllLabel="All networks"
    />
  );
};
