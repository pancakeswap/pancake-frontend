import { CardHeader, Flex, Heading, Text } from "@pancakeswap/uikit";
import getThemeValue from "@pancakeswap/uikit/util/getThemeValue";
import { ReactNode } from "react";
import { styled } from "styled-components";
import Tags from "../farm/components/Tags";

const { AlpBoostedTag } = Tags;

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : getThemeValue(theme, `colors.${background}`)};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`;

export const PoolCardHeader: React.FC<
  React.PropsWithChildren<{
    isFinished?: boolean;
    isStaking?: boolean;
  }>
> = ({ isFinished = false, isStaking = false, children }) => {
  const background = isStaking ? "gradientBubblegum" : "gradientCardHeader";

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        {children}
      </Flex>
    </Wrapper>
  );
};

export const PoolCardHeaderTitle: React.FC<
  React.PropsWithChildren<{
    isFinished?: boolean;
    title: ReactNode;
    subTitle: ReactNode;
    showBoostedTag?: boolean;
    headerTooltipComponent?: ReactNode;
  }>
> = ({ isFinished, title, subTitle, showBoostedTag, headerTooltipComponent }) => {
  return (
    <Flex flexDirection="column">
      <Flex>
        <Heading color={isFinished ? "textDisabled" : "body"} scale="lg">
          {title}
        </Heading>
        {headerTooltipComponent}
      </Flex>
      <Flex>
        <Text style={{ alignSelf: "flex-end" }} fontSize="14px" color={isFinished ? "textDisabled" : "textSubtle"}>
          {subTitle}
        </Text>
        {showBoostedTag && <AlpBoostedTag scale="sm" m="4px 0 0 4px" />}
      </Flex>
    </Flex>
  );
};
