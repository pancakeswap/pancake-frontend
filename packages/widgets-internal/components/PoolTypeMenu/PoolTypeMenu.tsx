import { ButtonMenu, ButtonMenuItem } from "@pancakeswap/uikit";

export interface IPoolTypeMenuProps {
  data: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export const PoolTypeMenu: React.FC<IPoolTypeMenuProps> = ({ data, activeIndex, onChange }) => (
  <ButtonMenu scale="sm" activeIndex={activeIndex} onItemClick={onChange} variant="subtle">
    {data.map((type) => (
      <ButtonMenuItem key={type} height="38px">
        {type}
      </ButtonMenuItem>
    ))}
  </ButtonMenu>
);
