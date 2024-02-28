import { Button, Flex, Link, OpenNewIcon, Text, useMatchBreakpoints } from "@pancakeswap/uikit";
import styled from "styled-components";
import { LinkExternalAction } from "./actions/LinkExternal";

const StyledButton = styled(Button)<{
  $backgroundColor?: string;
  $textColor?: string;
  $boxShadow?: string;
}>`
  ${({ $textColor }) => $textColor && `color: ${$textColor}`};
  ${({ $backgroundColor }) => $backgroundColor && `background: ${$backgroundColor}`};
  ${({ $boxShadow }) => $boxShadow && `box-shadow: ${$boxShadow}`};

  &:hover > a {
    text-decoration: none;
  }
`;

interface BannerActionContainerProps {
  firstButtonTitle: string;
  firstButtonBackgroundColor?: string;
  firstButtonTextColor?: string;
  firstButtonBoxShadowColor?: string;
  firstButtonLink: string;

  secondButtonTitle?: string;
  secondButtonTextColor?: string;
  secondButtonLink?: string;
}

export const BannerActionContainer = ({
  firstButtonTitle,
  firstButtonTextColor,
  firstButtonBackgroundColor,
  firstButtonBoxShadowColor,
  firstButtonLink,

  secondButtonTitle,
  secondButtonTextColor,
  secondButtonLink,
}: BannerActionContainerProps) => {
  const { isMobile, isXxl } = useMatchBreakpoints();

  return (
    <Flex mb={["20px", "20px", "20px", "20px", "0"]}>
      <StyledButton
        scale={isXxl ? "md" : "sm"}
        $textColor={firstButtonTextColor}
        $boxShadow={firstButtonBoxShadowColor}
        $backgroundColor={firstButtonBackgroundColor}
      >
        <Link external href={firstButtonLink}>
          <Text
            bold
            mr="4px"
            color="white"
            fontSize={isMobile ? "12px" : "16px"}
            textTransform={isMobile ? "uppercase" : "capitalize"}
          >
            {firstButtonTitle}
          </Text>
          <OpenNewIcon color="white" />
        </Link>
      </StyledButton>
      {secondButtonTitle && (
        <LinkExternalAction
          ml="8px"
          href={secondButtonLink}
          color={secondButtonTextColor}
          style={{ alignItems: "center" }}
        >
          {secondButtonTitle}
        </LinkExternalAction>
      )}
    </Flex>
  );
};
