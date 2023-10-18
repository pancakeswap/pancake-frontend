import { useTranslation } from "@pancakeswap/localization";
import { Text } from "../Text";
import { Dots } from "../Loader/Dots";

export function LoadingDot() {
  const { t } = useTranslation();

  return (
    <Text color="textSubtle" textAlign="center">
      <Dots>{t("Loading")}</Dots>
    </Text>
  );
}
