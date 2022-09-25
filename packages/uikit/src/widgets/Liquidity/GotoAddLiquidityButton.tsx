import { useTranslation } from "@pancakeswap/localization";
import Link from "next/link";
import { AddIcon, Button } from "../../components";

export function GotoAddLiquidityButton() {
  const { t } = useTranslation();

  return (
    <Link href="/add" passHref>
      <Button id="join-pool-button" width="100%" startIcon={<AddIcon color="white" />}>
        {t("Add Liquidity")}
      </Button>
    </Link>
  );
}
