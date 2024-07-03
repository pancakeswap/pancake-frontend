import { MultiSelect, IOptionType } from "@pancakeswap/uikit";

export interface ITokenProps {
  data?: IOptionType;
}

export const TokenFilter: React.FC<ITokenProps> = ({ data = [] }) => {
  return (
    <MultiSelect
      style={{
        width: "273px",
      }}
      panelStyle={{
        minHeight: "500px",
      }}
      scrollHeight="200px"
      options={data}
      isFilter
    />
  );
};
