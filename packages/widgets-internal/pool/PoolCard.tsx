import { useTranslation } from "@pancakeswap/localization";
import { CardBody, CardRibbon, Flex, Skeleton } from "@pancakeswap/uikit";
import { ReactElement, useMemo } from "react";
import { PoolCardHeader, PoolCardHeaderTitle } from "./PoolCardHeader";
import { StyledCard } from "./StyledCard";
import { DeserializedPool } from "./types";

interface PoolCardPropsType<T> {
  pool: DeserializedPool<T>;
  cardContent: ReactElement;
  aprRow: ReactElement;
  cardFooter: ReactElement;
  tokenPairImage: ReactElement;
  isStaked: boolean;
  isBoostedPool?: boolean;
  headerTooltipComponent?: ReactElement;
}

export function PoolCard<T>({
  pool,
  cardContent,
  aprRow,
  isStaked,
  cardFooter,
  tokenPairImage,
  isBoostedPool,
  headerTooltipComponent,
}: PoolCardPropsType<T>) {
  const { sousId, stakingToken, earningToken, isFinished, totalStaked } = pool;
  const { t } = useTranslation();

  const isCakePool = earningToken?.symbol === "CAKE" && stakingToken?.symbol === "CAKE";

  const showBoostedTag = useMemo(() => !isFinished && isBoostedPool, [isFinished, isBoostedPool]);

  return (
    <StyledCard
      isActive={isCakePool}
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t("Finished")} />}
    >
      <PoolCardHeader isStaking={isStaked} isFinished={isFinished && sousId !== 0}>
        {totalStaked && totalStaked.gte(0) ? (
          <>
            <PoolCardHeaderTitle
              title={isCakePool ? t("Manual") : t("Earn %asset%", { asset: earningToken?.symbol || "" })}
              subTitle={
                isCakePool ? t("Earn CAKE, stake CAKE") : t("Stake %symbol%", { symbol: stakingToken?.symbol || "" })
              }
              showBoostedTag={showBoostedTag}
              headerTooltipComponent={headerTooltipComponent}
            />
            {tokenPairImage}
          </>
        ) : (
          <Flex width="100%" justifyContent="space-between">
            <Flex flexDirection="column">
              <Skeleton width={100} height={26} mb="4px" />
              <Skeleton width={65} height={20} />
            </Flex>
            <Skeleton width={58} height={58} variant="circle" />
          </Flex>
        )}
      </PoolCardHeader>
      <CardBody>
        {aprRow}
        <Flex mt="24px" flexDirection="column">
          {cardContent}
        </Flex>
      </CardBody>
      {cardFooter}
    </StyledCard>
  );
}
