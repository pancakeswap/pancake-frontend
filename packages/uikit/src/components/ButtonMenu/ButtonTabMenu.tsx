import { styled, useTheme } from "styled-components";
import ButtonMenu from "./ButtonMenu";
import ButtonMenuItem from "./ButtonMenuItem";

const Wrapper = styled.div`
  & > div {
    width: 100%;
    background-color: ${({ theme }) => theme.colors.input};
    border: 0;
  }
  & button {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.input};
    border-radius: 20px 20px 0 0;
  }
`;

interface ButtonTabMenuProps {
  activeIndex: number;
  itemList: string[];
  onItemClick: (index: number) => void;
}

const ButtonTabMenu: React.FC<React.PropsWithChildren<ButtonTabMenuProps>> = ({
  activeIndex,
  itemList,
  onItemClick,
}) => {
  const theme = useTheme();

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} onItemClick={onItemClick}>
        {itemList.map((content, idx) => (
          <ButtonMenuItem
            key={content}
            style={{
              color: idx === activeIndex ? theme.colors.text : theme.colors.textSubtle,
              backgroundColor: idx === activeIndex ? theme.card.background : theme.colors.input,
            }}
          >
            {content}
          </ButtonMenuItem>
        ))}
      </ButtonMenu>
    </Wrapper>
  );
};

export default ButtonTabMenu;
