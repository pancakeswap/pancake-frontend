import { useTheme } from "@pancakeswap/hooks";
import { MultiSelect, IOptionType } from "@pancakeswap/uikit";

export interface ITokenProps {
  data?: IOptionType;
}

export const TokenFilter: React.FC<ITokenProps> = ({ data = [] }) => {
  const { theme } = useTheme();

  return (
    <MultiSelect
      style={{
        width: "328px",
        background: theme.colors.input,
      }}
      panelStyle={{
        minHeight: "382px",
      }}
      scrollHeight="382px"
      options={data}
      isFilter
      panelFooterTemplate={() => <span>Don’t see expected tokens?</span>}
    />
  );
};
