import React from "react";
import styled from "styled-components";
import { DropdownProps } from "./types";

const DropdownContent = styled.div`
  width: max-content;
  display: none;
  flex-direction: column;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: ${({ theme }) => theme.nav.background};
  box-shadow: ${({ theme }) => theme.shadows.level1};
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  border-radius: ${({ theme }) => theme.radii.small};
`;

const Container = styled.div`
  position: relative;
  &:hover ${DropdownContent}, &:focus-within ${DropdownContent} {
    display: flex;
  }
`;

const Dropdown: React.FC<DropdownProps> = ({ target, children }) => {
  return (
    <Container>
      {target}
      <DropdownContent>{children}</DropdownContent>
    </Container>
  );
};

export default Dropdown;
