import { useTranslation } from "@pancakeswap/localization";
import { Percent } from "@pancakeswap/swap-sdk-core";
import { useCallback } from "react";
import { useConfirm, usePrompt } from "../../uikit/src/hooks/useDialog";

export const useAsyncConfirmPriceImpactWithoutFee = (
  priceImpactWithoutFee: Percent | undefined,
  priceImpactWithoutFeeConfirmMin: Percent,
  allowedPriceImpactHigh: Percent
) => {
  const confirm = useConfirm();
  const prompt = usePrompt();
  const { t } = useTranslation();

  return useCallback(() => {
    let resolve: (value: boolean) => void;
    const p = new Promise<boolean>((res) => {
      resolve = res;
    });

    if (!priceImpactWithoutFee) return true;

    if (!priceImpactWithoutFee.lessThan(priceImpactWithoutFeeConfirmMin)) {
      const confirmWord = "confirm";
      prompt({
        message: t(
          'This swap has a price impact of at least %amount%%. Please type the word "%word%" to continue with this swap.',
          {
            amount: priceImpactWithoutFeeConfirmMin.toFixed(0),
            word: confirmWord,
          }
        ),
        onConfirm: (value: string) => {
          if (value === confirmWord) {
            return resolve(true);
          }
          return resolve(false);
        },
      });
    } else if (!priceImpactWithoutFee.lessThan(allowedPriceImpactHigh)) {
      confirm({
        message: t(
          "This swap has a price impact of at least %amount%%. Please confirm that you would like to continue with this swap.",
          {
            amount: allowedPriceImpactHigh.toFixed(0),
          }
        ),
        onConfirm: (result: boolean) => resolve(result),
      });
    } else {
      resolve!(true);
    }
    return p;
  }, [allowedPriceImpactHigh, confirm, priceImpactWithoutFee, priceImpactWithoutFeeConfirmMin, prompt, t]);
};
