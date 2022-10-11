import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { getFullDisplayBalance } from "@pancakeswap/utils/formatBalance";
import { Button } from "../../../../components/Button";
import { AutoRenewIcon } from "../../../../components/Svg";
import { Message, MessageText } from "../../../../components/Message";
import { Box } from "../../../../components/Box";
import { Modal, ModalBody, ModalActions, ModalInput } from "../../../Modal/index";

interface WithdrawModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  onDismiss?: () => void;
  tokenName?: string;
  showActiveBooster?: boolean;
  showCrossChainFarmWarning?: boolean;
}

const WithdrawModal: React.FC<React.PropsWithChildren<WithdrawModalProps>> = ({
  onConfirm,
  onDismiss,
  max,
  tokenName = "",
  showActiveBooster,
  showCrossChainFarmWarning,
}) => {
  const [val, setVal] = useState("");
  const [pendingTx, setPendingTx] = useState(false);
  const { t } = useTranslation();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max);
  }, [max]);

  const valNumber = new BigNumber(val);
  const fullBalanceNumber = new BigNumber(fullBalance);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, "."));
      }
    },
    [setVal]
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  return (
    <Modal title={t("Unstake LP tokens")} onDismiss={onDismiss}>
      <ModalBody width={["100%", "100%", "100%", "420px"]}>
        <ModalInput
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          value={val}
          max={fullBalance}
          symbol={tokenName}
          inputTitle={t("Unstake")}
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
