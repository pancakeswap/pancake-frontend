import React, { cloneElement, Children, ReactElement } from "react";
import styled from "styled-components";
import Flex from "../Box/Flex";
import { TabMenuProps } from "./types";

const Wrapper = styled(Flex)`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  overflow-x: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const Inner = styled(Flex)`
  justify-content: space-between;
  flex-grow: 1;

  & > button + button {
    margin-left: 4px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-grow: 0;
  }
`;

const ButtonMenu: React.FC<TabMenuProps> = ({ activeIndex = 0, onItemClick, children }) => {
  return (
    <Wrapper p={["0 4px", "0 16px"]}>
      <Inner>
        {Children.map(children, (child: ReactElement, index) => {
          const isActive = activeIndex === index;
          return cloneElement(child, {
            isActive,
            onClick: onItemClick ? () => onItemClick(index) : undefined,
            color: isActive ? "backgroundAlt" : "textSubtle",
            backgroundColor: isActive ? "textSubtle" : "input",
          });
        })}
      </Inner>
    </Wrapper>
  );
};

export default ButtonMenu;
