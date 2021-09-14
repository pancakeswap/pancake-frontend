import styled from "styled-components";

export const TimelineContainer = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
`;

export const TimelineEvent = styled.li`
  display: flex;
  position: relative;
  margin-bottom: 14px;

  &:after {
    content: "";
    position: absolute;
    left: 9px;
    top: 26px;
    width: 2px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:last-child:after {
    display: none;
  }
`;
