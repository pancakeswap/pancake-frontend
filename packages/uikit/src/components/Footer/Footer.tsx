import { useIsMounted } from "@pancakeswap/hooks";
import React from "react";
import { useMatchBreakpoints } from "../../contexts";
import { Box, Flex } from "../Box";
import { Link } from "../Link";
import { StyledFooter, StyledIconMobileContainer, StyledList, StyledListItem, StyledText } from "./styles";

import { vars } from "../../css/vars.css";
import { LogoIcon, LogoWithTextIcon } from "../Svg";
import SocialLinks from "./Components/SocialLinks";
import { FooterProps } from "./types";

const MenuItem: React.FC<React.PropsWithChildren<FooterProps>> = ({
  items,
  isDark,
  toggleTheme,
  currentLang,
  langs,
  setLang,
  cakePriceUsd,
  buyCakeLabel,
  buyCakeLink,
  chainId,
  ...props
}) => {
  const isMounted = useIsMounted();
  const { isXl } = useMatchBreakpoints();
  return (
    <StyledFooter
      data-theme="dark"
      p={["40px 16px", null, "56px 40px 32px 40px"]}
      position="relative"
      {...props}
      justifyContent="center"
    >
      <Flex flexDirection="column" width={["100%", null, "1200px;"]}>
        <StyledIconMobileContainer display={["block", null, "none"]}>
          <LogoWithTextIcon width="130px" />
        </StyledIconMobileContainer>
        <Flex
          order={[2, null, 1]}
          flexDirection={["column", "column", "column", "column", "row", "row"]}
          justifyContent="space-between"
          alignItems="flex-start"
          mb={["42px", null, "36px"]}
        >
          {items?.map((item) => (
            <StyledList key={item.label}>
              <StyledListItem>{item.label}</StyledListItem>
              {item.items?.map(({ label, href, isHighlighted = false }) => (
                <StyledListItem key={label}>
                  {href ? (
                    <Link
                      data-theme="dark"
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      color={isHighlighted ? vars.colors.warning : "contrast"}
                      bold={false}
                    >
                      {label}
                    </Link>
                  ) : (
                    <StyledText>{label}</StyledText>
                  )}
                </StyledListItem>
              ))}
            </StyledList>
          ))}
          <Box display={["none", null, "block"]}>{isXl ? <LogoIcon /> : <LogoWithTextIcon width="160px" />}</Box>
        </Flex>
        <SocialLinks order={[1]} />
      </Flex>
    </StyledFooter>
  );
};

export default MenuItem;
