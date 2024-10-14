import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { SpaceProps } from "styled-system";
import { FlexGap, Message, MessageText, InfoFilledIcon, Box, MessageProps, Link } from "@pancakeswap/uikit";
import { useTranslation } from "@pancakeswap/localization";
import styled from "styled-components";

type Props = {
  amount?: BigNumber | number;
} & SpaceProps;

const StyledMessage = styled(Message)`
  padding: 0.5rem;
  padding-left: 0.75rem;
`;

const WarningMessage = styled(StyledMessage).attrs({
  variant: "warning",
  icon: <InfoFilledIcon color="yellow" width={20} height={20} />,
})<Partial<MessageProps>>``;

const InfoMessage = styled(StyledMessage).attrs({
  variant: "primary",
  icon: <InfoFilledIcon color="secondary" width={20} height={20} />,
})<Partial<MessageProps>>``;

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

export function InsufficientNativeVeCakeTips(props: SpaceProps) {
  const { t } = useTranslation();

  return (
    <Box {...props}>
      <InfoMessage>
        <FlexGap flexDirection="column" gap="1rem">
          <MessageText>
            {t(
              "Position migrated from CAKE Pool can not be extended or topped up. To extend or add more CAKE, set up a native veCAKE position."
            )}
          </MessageText>
          <LinkMessageText bold>
            <Link
              external
              href="https://docs.pancakeswap.finance/products/vecake/migrate-from-cake-pool#10ffc408-be58-4fa8-af56-be9f74d03f42"
            >
              {t("Learn more")} {">>"}
            </Link>
          </LinkMessageText>
        </FlexGap>
      </InfoMessage>
    </Box>
  );
}
