import { vars } from "@pancakeswap/ui/css/vars.css";
import { useIsMounted } from "@pancakeswap/hooks";
import React from "react";
import { Lalezar, Rubik } from "next/font/google";
import { Box, Flex } from "../Box";
import { Link } from "../Link";
import {
  StyledFooter,
  StyledIconMobileContainer,
  StyledList,
  StyledListItem,
  StyledSocialLinks,
  StyledText,
  StyledToolsContainer,
  StyledBottomCopyright,
  StyledBottomImage,
  StyledTextLogo,
  StyledPowerdBy,
  StyledBombImage,
} from "./styles";

import { Button } from "../Button";
import CakePrice from "../CakePrice/CakePrice";
import LangSelector from "../LangSelector/LangSelector";
import {
  ArrowForwardIcon,
  LogoWithTextIcon,
  PoweredByIcon,
  TwitterIcon,
  TelegramIcon,
  DiscordIcon,
  MediumIcon,
  InstagramIcon,
} from "../Svg";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { FooterProps } from "./types";
import { SkeletonV2 } from "../Skeleton";
import BottomImage from "../../assets/bottom.png";
import FooterBombImage from "../../assets/footerBomb.png";

const lalezar = Lalezar({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const rubik = Rubik({
  weight: "600",
  subsets: ["latin"],
  display: "swap",
});

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
  return (
    <StyledFooter
      data-theme="dark"
      p={["40px 16px", null, "56px 40px 32px 40px"]}
      position="relative"
      {...props}
      justifyContent="center"
    >
      <Flex flexDirection="column" width={["100%", null, "1200px;"]}>
        {/* <StyledIconMobileContainer display={["block", null, "none"]}>
          <LogoWithTextIcon width="130px" />
        </StyledIconMobileContainer> */}
        <Flex
          order={[2, null, 1]}
          flexDirection={["column", null, "row"]}
          justifyContent="space-between"
          alignItems="flex-start"
          mb={["42px", null, "36px"]}
          style={{ zIndex: 1 }}
        >
          <Flex flexDirection="column" justifyContent={["center", null, "flex-start"]} width={["100%", null, "360px"]}>
            <Flex style={{ marginBottom: "50px" }} justifyContent={["center", null, "flex-start"]}>
              <TwitterIcon style={{ width: "30px" }} marginRight={["10px", null, "20px"]} />
              <TelegramIcon style={{ marginLeft: "20px", marginRight: "20px", width: "30px" }} />
              <DiscordIcon style={{ marginLeft: "20px", marginRight: "20px", width: "30px" }} />
              <MediumIcon style={{ marginLeft: "20px", marginRight: "20px", width: "30px" }} />
              <InstagramIcon style={{ marginLeft: "20px", width: "30px" }} />
            </Flex>
            <Flex
              flexDirection={["column", null, "row"]}
              alignItems={["center", null, "flex-start"]}
              marginBottom={["30px", null, "0"]}
            >
              <StyledTextLogo className={rubik.className} style={{ marginRight: "20px" }}>
                BASE <span>BOMB</span>
              </StyledTextLogo>
              <span style={{ color: "#949494", fontSize: "22px" }} className={lalezar.className}>
                runs on the fastest Layer 1 blockchain Fantom.
              </span>
            </Flex>
          </Flex>
          {items?.map((item) => (
            <StyledList key={item.label}>
              <StyledListItem className={lalezar.className}>{item.label}</StyledListItem>
              {item.items?.map(({ label, href, isHighlighted = false }) => (
                <StyledListItem key={label}>
                  {href ? (
                    <Link
                      data-theme="dark"
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{ fontSize: "15px" }}
                      className={lalezar.className}
                      color={isHighlighted ? "text" : vars.colors.grey}
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
          {/* <Box display={["none", null, "block"]}>
            <LogoWithTextIcon width="160px" />
          </Box> */}
        </Flex>
        {/* <StyledSocialLinks order={[2]} pb={["42px", null, "32px"]} mb={["0", null, "32px"]} /> */}
        <StyledToolsContainer
          data-theme="dark"
          order={[1, null, 3]}
          flexDirection={["column", null, "row"]}
          justifyContent="space-between"
        >
          {/* <Flex order={[2, null, 1]} alignItems="center">
            <SkeletonV2 variant="round" width="56px" height="32px" isDataReady={isMounted}>
              <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
            </SkeletonV2>
            <LangSelector
              currentLang={currentLang}
              langs={langs}
              setLang={setLang}
              color="textSubtle"
              dropdownPosition="top-right"
            />
          </Flex>
          <Flex order={[1, null, 2]} mb={["24px", null, "0"]} justifyContent="space-between" alignItems="center">
            <Box mr="20px">
              <CakePrice chainId={chainId} cakePriceUsd={cakePriceUsd} color="textSubtle" />  
            </Box>
            <Button
              data-theme={isDark ? "dark" : "light"}
              as="a"
              href={buyCakeLink}
              target="_blank"
              scale="sm"
              endIcon={<ArrowForwardIcon color="backgroundAlt" />}
            >
              {buyCakeLabel}
            </Button>
          </Flex> */}
          <Flex justifyContent="center" alignItems="center" width="100%">
            <StyledBottomImage src={BottomImage} alt="bottomBomb" />
            <StyledBottomCopyright className={lalezar.className}>@ 2023 opBOMB</StyledBottomCopyright>
          </Flex>
        </StyledToolsContainer>
        <Flex justifyContent={["center", null, "flex-start"]}>
          <StyledPowerdBy alignItems="center">
            <span className={lalezar.className} style={{ fontSize: "15px", color: vars.colors.grey }}>
              Poered by
            </span>
            <PoweredByIcon style={{ marginLeft: "20px", marginRight: "20px" }} />
            <span className={lalezar.className} style={{ fontSize: "22px" }}>
              basechain
            </span>
          </StyledPowerdBy>
        </Flex>
        <StyledBombImage src={FooterBombImage} alt="Bomb" />
      </Flex>
    </StyledFooter>
  );
};

export default MenuItem;
