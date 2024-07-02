import { useTranslation } from "@pancakeswap/localization";
import { ButtonMenu, ButtonMenuItem, Flex, NotificationDot, Text } from "@pancakeswap/uikit";
import { useRouter } from "next/router";
import React from "react";
import { styled } from "styled-components";
import { NextLinkFromReactRouter } from "../../components/NextLink";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`;

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean;
}

export const FarmTabButtons: React.FC<React.PropsWithChildren<FarmTabButtonsProps>> = ({ hasStakeInFinishedFarms }) => {
  const router = useRouter();
  const { t } = useTranslation();

  let activeIndex;
  switch (router.pathname) {
    case "/farms":
      activeIndex = 0;
      break;
    case "/farms/history":
      activeIndex = 1;
      break;
    case "/_mp/farms/history":
      activeIndex = 1;
      break;
    case "/farms/archived":
      activeIndex = 2;
      break;
    default:
      activeIndex = 0;
      break;
  }

  return (
    <Wrapper>
      <Flex width="max-content" flexDirection="column">
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
          {t("Filter by")}
        </Text>
        <ButtonMenu activeIndex={activeIndex} scale="sm" variant="yellow">
          <ButtonMenuItem as={NextLinkFromReactRouter} to="/farms">
            {t("Live")}
          </ButtonMenuItem>
          <NotificationDot show={hasStakeInFinishedFarms}>
            <ButtonMenuItem as={NextLinkFromReactRouter} to="/farms/history" id="finished-farms-button">
              {t("Finished")}
            </ButtonMenuItem>
          </NotificationDot>
        </ButtonMenu>
      </Flex>
    </Wrapper>
  );
};
