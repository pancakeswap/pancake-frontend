import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  target: React.ReactElement;
}

const DropdownContent = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  padding-left: 8px;

  ${({ theme }) => theme.mediaQueries.nav} {
    padding-left: 0;
    display: none;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: ${({ theme }) => theme.nav.background};
    box-shadow: ${({ theme }) => theme.shadows.level1};
    border-radius: ${({ theme }) => theme.radii.small};
    max-height: 500px;
    overflow-y: auto;
    z-index: ${({ theme }) => theme.zIndices.modal};
  }
`;

const Container = styled.div`
  width: 100%;
  position: relative;

  ${({ theme }) => theme.mediaQueries.nav} {
    width: fit-content;
    height: 100%;
    &:hover ${DropdownContent}, &:focus-within ${DropdownContent} {
      display: flex;
    }
  }
`;

const Dropdown: React.FC<Props> = ({ target, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Container onClick={() => setIsOpen((prevState) => !prevState)}>
      {target}
      <DropdownContent isOpen={isOpen}>{children}</DropdownContent>
    </Container>
  );
};

export default Dropdown;
