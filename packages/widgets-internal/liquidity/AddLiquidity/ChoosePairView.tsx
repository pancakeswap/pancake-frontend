import { useTranslation } from "@pancakeswap/localization";
import { CardBody, CardFooter, Box, Text, AddIcon, AtomBox } from "@pancakeswap/uikit";

export function ChoosePairView({
  selectCurrencyA,
  selectCurrencyB,
  // poolData,
  footer,
}: {
  selectCurrencyA: React.ReactElement;
  selectCurrencyB: React.ReactElement;
  footer: React.ReactElement;
  // poolData: {
  //   lpApr7d: number;
  // };
}) {
  const { t } = useTranslation();

  // const { targetRef, tooltip, tooltipVisible } = useTooltip(
  //   t(`Based on last 7 days' performance. Does not account for impermanent loss`),
  //   {
  //     placement: "bottom",
  //   }
  // );

  return (
    <>
      <CardBody>
        <Box>
          <Text textTransform="uppercase" color="secondary" bold small pb="24px">
            {t("Choose a valid pair")}
          </Text>
          <AtomBox display="flex" gap="4px">
            {selectCurrencyA}
            <AddIcon color="textSubtle" />
            {selectCurrencyB}
          </AtomBox>
          {/* {poolData && (
            <RowBetween mt="24px">
              <TooltipText ref={targetRef} bold fontSize="12px" color="secondary">
                {t("LP reward APR")}
              </TooltipText>
              {tooltipVisible && tooltip}
              <Text bold color="primary">
                {formatAmount(poolData.lpApr7d)}%
              </Text>
            </RowBetween>
          )} */}
        </Box>
      </CardBody>
      <CardFooter>{footer}</CardFooter>
    </>
  );
}
