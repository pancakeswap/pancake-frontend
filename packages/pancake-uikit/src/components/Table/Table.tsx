import styled from "styled-components";
import { space } from "styled-system";

const Table = styled.table`
  max-width: 100%;
  width: 100%;

  th,
  td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
    color: ${({ theme }) => theme.colors.text};
    padding: 16px;
  }

  th {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 12px;
    text-transform: uppercase;
  }

  tr:last-child {
    td {
      border-bottom: 0;
    }
  }

  ${space}
`;

export default Table;
