import Link from "next/link";
import { useTranslation } from "@pancakeswap/localization";
import { Text, Button } from "../../components";
import { AtomBox } from "../../components/AtomBox";

export function FindOtherLP() {
  const { t } = useTranslation();

  return (
    <AtomBox display="flex" flexDirection="column" alignItems="center" mt="24px">
      <Text color="textSubtle" mb="8px">
        {t("Don't see a pair you joined?")}
      </Text>
      <Link href="/find" passHref>
        <Button id="import-pool-link" variant="secondary" scale="sm">
          {t("Find other LP tokens")}
        </Button>
      </Link>
    </AtomBox>
  );
}
