import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { getBalanceNumber } from "@pancakeswap/utils/formatBalance";
import { Text } from "../../../../components/Text";
import { Skeleton } from "../../../../components/Skeleton";
import { Flex } from "../../../../components/Box";
import Tags from "../Tags";
import { FarmTableFarmTokenInfoProps } from "../../types";

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

const Farm: React.FunctionComponent<React.PropsWithChildren<FarmTableFarmTokenInfoProps>> = ({
  label,
  isReady,
  isStable,
  isBoosted,
  stakedBalance,
  children,
}) => {
  const { t } = useTranslation();
  const rawStakedBalance = stakedBalance ? getBalanceNumber(stakedBalance) : 0;

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t("Farming")}
        </Text>
      );
    }
    return <></>;
  };

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
        {handleRenderFarming()}
        <Text bold>{label}</Text>
      </div>
    </Container>
  );

  return (
    <Flex flexDirection="column">
      {pairContainer}
      <Container>
        <Flex flexDirection="row">
          {isStable ? <Tags.StableFarmTag mt="4px" /> : null}
          {isBoosted ? <Tags.BoostedTag mt="4px" ml="4px" /> : null}
        </Flex>
      </Container>
    </Flex>
  );
};

export default Farm;
