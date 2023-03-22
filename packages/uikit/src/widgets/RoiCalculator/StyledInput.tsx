import styled from "styled-components";

import { Input } from "../../components";

export const StyledInput = styled(Input)<{ textAlign?: string }>`
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding-left: 0;
  padding-right: 0;
  text-align: ${({ textAlign = "left" }) => textAlign};
  border: none;

  ::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:focus:not(:disabled) {
    box-shadow: none;
  }
`;
