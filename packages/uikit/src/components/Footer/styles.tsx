import styled from "styled-components";
import Image from "next/image";
import { vars } from "@pancakeswap/ui/css/vars.css";
import { darkColors } from "../../theme/colors";
import { Box, Flex } from "../Box";
import SocialLinks from "./Components/SocialLinks";

export const StyledFooter = styled(Flex)`
  background: #091321;
`;

export const StyledList = styled.ul`
  list-style: none;
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 0px;
  }
`;

export const StyledListItem = styled.li`
  font-size: 16px;
  margin-bottom: 8px;
  text-transform: capitalize;
  margin-bottom: 20px;

  &:first-child {
    color: ${vars.colors.white};
    font-weight: 400;
    font-size: 22px;
  }
`;

export const StyledIconMobileContainer = styled(Box)`
  margin-bottom: 24px;
`;

export const StyledToolsContainer = styled(Flex)`
  border-color: ${darkColors.cardBorder};
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-style: solid;
  padding: 24px 0;
  margin-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    border-top-width: 0;
    border-bottom-width: 0;
    padding: 0 0;
    margin-bottom: 0;
  }
`;

export const StyledSocialLinks = styled(SocialLinks)`
  border-bottom: 1px solid ${darkColors.cardBorder};
`;

export const StyledText = styled.span`
  color: ${darkColors.text};
`;

export const StyledBottomCopyright = styled.span`
  color: ${vars.colors.white};
  z-index: 1;
`;

export const StyledBottomImage = styled(Image)`
  position: absolute;
  bottom: 0;
`;

export const StyledTextLogo = styled.span`
  color: ${vars.colors.white};
  width: 210px;
  font-size: 19px;
  & > span {
    color: #2d98fb;
  }

  @media (max-width: 576px) {
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
  }
`;

export const StyledPowerdBy = styled(Flex)`
  border: 1px solid white;
  border-radius: 50px;
  position: absolute;
  bottom: 20px;
  padding: 18px;
`;

export const StyledBombImage = styled(Image)`
  position: absolute;
  right: 70px;
  bottom: 130px;
`;
