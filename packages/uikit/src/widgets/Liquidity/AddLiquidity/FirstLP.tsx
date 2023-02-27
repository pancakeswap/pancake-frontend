import { useTranslation } from "@pancakeswap/localization";

import { Message, Text, Column } from "../../../components";

export function FirstLP() {
  const { t } = useTranslation();

  return (
    <Column width="100%" alignItems="center">
      <Message variant="warning">
        <div>
          <Text bold mb="8px">
            {t("You are the first liquidity provider.")}
          </Text>
          <Text mb="8px">{t("The ratio of tokens you add will set the price of this pair.")}</Text>
          <Text>{t("Once you are happy with the rate click supply to review.")}</Text>
        </div>
      </Message>
    </Column>
  );
}
