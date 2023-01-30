import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { getFullDisplayBalance } from "@pancakeswap/utils/formatBalance";
import { trimTrailZero } from "@pancakeswap/utils/trimTrailZero";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { Button } from "../../../../components/Button";
import { AutoRenewIcon } from "../../../../components/Svg";
import { Message, MessageText } from "../../../../components/Message";
import { Box } from "../../../../components/Box";
import { Modal, ModalBody, ModalActions, ModalInput } from "../../../Modal/index";

interface WithdrawModalProps {
  max: BigNumber;
  lpPrice?: BigNumber;
  onConfirm: (amount: string) => void;
  onDismiss?: () => void;
  tokenName?: string;
  showActiveBooster?: boolean;
  showCrossChainFarmWarning?: boolean;
  decimals: number;
}

const WithdrawModal: React.FC<React.PropsWithChildren<WithdrawModalProps>> = ({
  onConfirm,
  onDismiss,
  max,
  lpPrice = BIG_ZERO,
  tokenName = "",
  showActiveBooster,
  showCrossChainFarmWarning,
  decimals,
}) => {
  const [val, setVal] = useState("");
  const [valUSDPrice, setValUSDPrice] = useState(BIG_ZERO);
  const [pendingTx, setPendingTx] = useState(false);
  const { t } = useTranslation();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, decimals);
  }, [max, decimals]);

  const valNumber = new BigNumber(val);
  const fullBalanceNumber = useMemo(() => new BigNumber(fullBalance), [fullBalance]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        const inputVal = e.currentTarget.value.replace(/,/g, ".");
        setVal(inputVal);

        const USDPrice = inputVal === "" ? BIG_ZERO : new BigNumber(inputVal).times(lpPrice);
        setValUSDPrice(USDPrice);
      }
    },
    [setVal, setValUSDPrice, lpPrice]
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);

    const USDPrice = new BigNumber(fullBalance).times(lpPrice);
    setValUSDPrice(USDPrice);
  }, [fullBalance, setVal, setValUSDPrice, lpPrice]);

  const handlePercentInput = useCallback(
    (percent: number) => {
      const totalAmount = fullBalanceNumber.dividedBy(100).multipliedBy(percent);
      const amount = trimTrailZero(totalAmount.toNumber().toFixed(decimals));
      setVal(amount as string);

      const USDPrice = totalAmount.times(lpPrice);
      setValUSDPrice(USDPrice);
    },
    [fullBalanceNumber, decimals, lpPrice]
  );

  return (
    <Modal title={t("Unstake LP tokens")} onDismiss={onDismiss}>
      <ModalBody width={["100%", "100%", "100%", "420px"]}>
        <ModalInput
          onSelectMax={handleSelectMax}
          onPercentInput={handlePercentInput}
          onChange={handleChange}
          value={val}
          valueUSDPrice={valUSDPrice}
          max={fullBalance}
          maxAmount={fullBalanceNumber}
          symbol={tokenName}
          inputTitle={t("Unstake")}
          decimals={decimals}
        />
        {showActiveBooster ? (
          <Message variant="warning" mt="8px">
            <MessageText>
              {t("The yield booster multiplier will be updated based on the latest staking conditions.")}
            </MessageText>
          </Message>
        ) : null}
        {showCrossChainFarmWarning && (
          <Box mt="15px">
            <Message variant="warning">
              <MessageText>
                {t("For safety, cross-chain transactions will take around 30 minutes to confirm.")}
              </MessageText>
            </Message>
          </Box>
        )}
        <ModalActions>
          <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
            {t("Cancel")}
          </Button>
          {pendingTx ? (
            <Button width="100%" isLoading={pendingTx} endIcon={<AutoRenewIcon spin color="currentColor" />}>
              {t("Confirming")}
            </Button>
          ) : (
            <Button
              width="100%"
              disabled={!valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
              onClick={async () => {
                setPendingTx(true);
                await onConfirm(val);
                onDismiss?.();
                setPendingTx(false);
              }}
            >
              {t("Confirm")}
            </Button>
          )}
        </ModalActions>
      </ModalBody>
    </Modal>
  );
};

export default WithdrawModal;
