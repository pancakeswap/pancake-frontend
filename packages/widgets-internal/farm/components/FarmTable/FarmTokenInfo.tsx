import { useTranslation } from "@pancakeswap/localization";
import { Box, Flex, Link, Row, Skeleton, Text, TooltipText, WarningIcon, useTooltip } from "@pancakeswap/uikit";
import { useMemo } from "react";
import { styled } from "styled-components";
import { isMobile } from "react-device-detect";
import { FarmTableFarmTokenInfoProps } from "../../types";

const InlineLink = styled(Link)`
  display: inline;
  margin-left: 4px;
`;

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`;

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`;

const MerklTooltip: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Box>
        <Text display="inline">
          <p>
            {t("Incentives have moved to")}
            <InlineLink
              external
              display="inline"
              href="https://merkl.angle.money/?times=active%2Cfuture%2C&phrase=RETH&chains=1%2C"
            >
              {t("Merkl")}
            </InlineLink>
            , {t("and are now claimable without staking your LP token.")}
          </p>
          <br />
          {t("Continue seeding your liquidity on PancakeSwap to accrue the rewards!")}
        </Text>
      </Box>
    </>
  );
};

const Farm: React.FunctionComponent<React.PropsWithChildren<FarmTableFarmTokenInfoProps>> = ({
  label,
  isReady,
  isStaking,
  children,
}) => {
  const { t } = useTranslation();
  const { tooltip, tooltipVisible, targetRef } = useTooltip(<MerklTooltip />, {
    placement: "top-start",
    tooltipOffset: [-20, 10],
    trigger: isMobile ? "focus" : "hover",
  });

  const handleRenderFarming = useMemo(() => {
    if (isStaking) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t("Farming")}
        </Text>
      );
    }
    return <></>;
  }, [t, isStaking]);

  if (!isReady) {
    return (
      <Container>
        <Skeleton mr="8px" width={32} height={32} variant="circle" />
        <div>
          <Skeleton width={40} height={10} mb="4px" />
          <Skeleton width={60} height={24} />
        </div>
      </Container>
    );
  }

  const pairContainer = (
    <Container>
      <TokenWrapper>{children}</TokenWrapper>
      <div>
        {handleRenderFarming}
        <Row gap="sm">
          <Text bold>{label}</Text>
          <TooltipText ref={targetRef}>
            <Text lineHeight={0}>
              <WarningIcon color="warning" />
            </Text>
          </TooltipText>
        </Row>
        {tooltipVisible ? tooltip : null}
      </div>
    </Container>
  );

  return <Flex flexDirection="column">{pairContainer}</Flex>;
};

export default Farm;
