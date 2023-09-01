import { styled } from "styled-components";
import { lightColors } from "../../theme/colors";

export const TimelineContainer = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
`;

export const TimelineEvent = styled.li<{ $useDark: boolean }>`
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
    background-color: ${({ theme, $useDark }) => ($useDark ? theme.colors.textSubtle : lightColors.textSubtle)};
  }

  &:last-child:after {
    display: none;
  }
`;
