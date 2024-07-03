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
      scrollHeight="400px"
      options={data}
      isFilter
    />
  );
};
