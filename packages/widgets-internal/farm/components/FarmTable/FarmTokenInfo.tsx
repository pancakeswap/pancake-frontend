import { useTranslation } from "@pancakeswap/localization";
import { Flex, Row, Skeleton, Text } from "@pancakeswap/uikit";
import { useMemo } from "react";
import { styled } from "styled-components";
import { FarmTableFarmTokenInfoProps } from "../../types";
import MerklNotice from "../MerklNotice";

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
  isStaking,
  merklLink,
  hasBothFarmAndMerkl,
  children,
  merklApr,
  merklUserLink,
}) => {
  const { t } = useTranslation();

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
          {merklLink ? (
            <MerklNotice.WithTooltip
              hasFarm={hasBothFarmAndMerkl}
              merklLink={merklLink}
              merklApr={merklApr}
              merklUserLink={merklUserLink}
            />
          ) : null}
        </Row>
      </div>
    </Container>
  );

  return <Flex flexDirection="column">{pairContainer}</Flex>;
};

export default Farm;
