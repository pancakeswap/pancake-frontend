import styled from "styled-components";

export const ActionContainer = styled.div`
  padding: 16px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 12px;
    /* max-height: 130px; */
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-right: 0;
    margin-bottom: 0;
    /* max-height: 130px; */
  }
`;

export const ActionTitles = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const IconButtonWrapper = styled.div`
  display: flex;
`;

export const StyledActionContainer = styled(ActionContainer)`
  &:nth-child(3) {
    flex-basis: 100%;
  }
  min-height: 124.5px;
  ${({ theme }) => theme.mediaQueries.sm} {
    &:nth-child(3) {
      margin-top: 16px;
    }
  }
`;
