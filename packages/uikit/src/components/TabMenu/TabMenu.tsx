import React, { cloneElement, Children, ReactElement } from "react";
import styled from "styled-components";
import Flex from "../Box/Flex";
import { TabMenuProps } from "./types";

const Wrapper = styled(Flex)<{ fullWidth?: boolean }>`
  border-bottom: 2px solid ${({ theme }) => theme.colors.input};
  overflow-x: scroll;
  padding: ${({ fullWidth }) => (fullWidth ? 0 : "16px")};

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const Inner = styled(Flex)<{ fullWidth?: boolean }>`
  justify-content: space-between;

  & > button + button {
    margin-left: 4px;
  }

  & > button {
    flex-grow: ${({ fullWidth }) => (fullWidth ? 1 : 0)};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-grow: ${({ fullWidth }) => (fullWidth ? 1 : 0)};
  }

  flex-grow: ${({ fullWidth }) => (fullWidth ? 1 : 0)};
`;

const ButtonMenu: React.FC<React.PropsWithChildren<TabMenuProps>> = ({
  activeIndex = 0,
  onItemClick,
  children,
  fullWidth,
}) => {
  return (
    <Wrapper p={["0 4px", "0 16px"]} fullWidth={fullWidth}>
      <Inner fullWidth={fullWidth}>
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
