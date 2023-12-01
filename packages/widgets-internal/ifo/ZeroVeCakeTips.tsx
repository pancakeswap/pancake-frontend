import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { SpaceProps } from "styled-system";
import { FlexGap, Message, MessageText, InfoFilledIcon, Box } from "@pancakeswap/uikit";
import { useTranslation } from "@pancakeswap/localization";

type Props = {
  amount?: BigNumber | number;
} & SpaceProps;

export function ZeroVeCakeTips({ amount = 0, ...props }: Props) {
  const { t } = useTranslation();
  const hasVeCake = useMemo(() => new BigNumber(amount).toNumber() !== 0, [amount]);

  if (hasVeCake) {
    return null;
  }
  return (
    <Box {...props}>
      <Message variant="warning" icon={<InfoFilledIcon color="yellow" width={20} height={20} />}>
        <FlexGap flexDirection="column" gap="1rem">
          <MessageText>{t("You have no veCAKE at the snapshot time.")}</MessageText>
          <MessageText>
            {t("To participate, lock CAKE to get veCAKE. Or extend your veCAKE position beyond the snapshot time.")}
          </MessageText>
        </FlexGap>
      </Message>
    </Box>
  );
}
