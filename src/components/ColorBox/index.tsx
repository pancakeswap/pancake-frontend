import styled from "styled-components";

const Panel = styled.div`
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  color: ${({ theme }) => theme.colors.text};
  padding: 16px;
`;

export default Panel;
