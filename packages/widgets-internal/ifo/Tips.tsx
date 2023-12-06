import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { SpaceProps } from "styled-system";
import { FlexGap, Message, MessageText, InfoFilledIcon, Box, MessageProps } from "@pancakeswap/uikit";
import Link from "next/link";
import { useTranslation } from "@pancakeswap/localization";
import styled from "styled-components";

type Props = {
  amount?: BigNumber | number;
} & SpaceProps;

const WarningMessage = styled(Message).attrs({
  variant: "warning",
  icon: <InfoFilledIcon color="yellow" width={20} height={20} />,
})<Partial<MessageProps>>`
  padding: 0.5rem;
  padding-left: 0.75rem;
`;

export function ZeroVeCakeTips({ amount = 0, ...props }: Props) {
  const { t } = useTranslation();
  const hasVeCake = useMemo(() => new BigNumber(amount).toNumber() !== 0, [amount]);

  if (hasVeCake) {
    return null;
  }
  return (
    <Box {...props}>
      <WarningMessage>
        <FlexGap flexDirection="column" gap="1rem">
          <MessageText>{t("You have no veCAKE at the snapshot time.")}</MessageText>
          <MessageText>
            {t("To participate, lock CAKE to get veCAKE. Or extend your veCAKE position beyond the snapshot time.")}
          </MessageText>
        </FlexGap>
      </WarningMessage>
    </Box>
  );
}

const LinkMessageText = styled(MessageText)`
  text-decoration: underline;
`;

export function MigrateVeCakeTips(props: SpaceProps) {
  const { t } = useTranslation();

  return (
    <Box {...props}>
      <WarningMessage>
        <FlexGap flexDirection="column" gap="1rem">
          <MessageText>
            {t("To participate, you need to migrate your fixed-term CAKE staking position to veCAKE.")}
          </MessageText>
          <LinkMessageText bold>
            <Link href="https://pancakeswap.finance">
              {t("Learn more")} {">>"}
            </Link>
          </LinkMessageText>
        </FlexGap>
      </WarningMessage>
    </Box>
  );
}
