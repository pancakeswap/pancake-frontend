import { useTranslation } from "@pancakeswap/localization";
import { Text, Dots } from "../../components";

export function LoadingDot() {
  const { t } = useTranslation();

  return (
    <Text color="textSubtle" textAlign="center">
      <Dots>{t("Loading")}</Dots>
    </Text>
  );
}
