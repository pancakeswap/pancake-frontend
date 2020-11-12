import styled from "styled-components";

export const Bar = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 32px;
  height: 16px;
  transition: width 200ms ease;
`;

const StyledProgress = styled.div`
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 32px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  height: 16px;
`;

export default StyledProgress;
