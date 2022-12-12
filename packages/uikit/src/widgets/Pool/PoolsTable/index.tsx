import { useRef } from "react";
import styled from "styled-components";

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  scroll-margin-top: 64px;

  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }

  > div:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.radii.card};
    border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }
`;

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`;

export const PoolsTable: React.FC<React.PropsWithChildren> = ({ children }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null);

  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {children}
      </StyledTable>
    </StyledTableBorder>
  );
};
