import React from "react";
import styled from "styled-components";

interface Props {
  target: React.ReactElement;
}

const DropdownContent = styled.div`
  display: none;
  width: max-content;
  flex-direction: column;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: ${({ theme }) => theme.nav.background};
  box-shadow: ${({ theme }) => theme.shadows.level1};
  padding: 16px;
  border-radius: 16px;
  max-height: 500px;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndices.modal};
`;

const Container = styled.div`
  width: fit-content;
  position: relative;
  &:hover ${DropdownContent}, &:focus-within ${DropdownContent} {
    display: flex;
  }
`;

const Dropdown: React.FC<Props> = ({ target, children }) => {
  return (
    <Container>
      {target}
      <DropdownContent>{children}</DropdownContent>
    </Container>
  );
};

export default Dropdown;
