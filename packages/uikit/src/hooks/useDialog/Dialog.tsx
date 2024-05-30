import { useTranslation } from "@pancakeswap/localization";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { BoxProps } from "../../components/Box";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import FlexGap from "../../components/Layouts/FlexGap";
import { Text } from "../../components/Text";
import Modal from "../../widgets/Modal/Modal";
import { ModalV2, ModalV2Props } from "../../widgets/Modal/ModalV2";

type DialogProps = ModalV2Props &
  BoxProps & {
    title?: string;
    message?: string;
    defaultValue?: string;
    confirmText?: string;
    cancelText?: string;
    useInput: boolean;
    onConfirm: ((value: string) => void) | ((value: boolean) => void);
  };

export const Dialog: React.FC<DialogProps> = ({
  title,
  message,
  defaultValue,
  placeholder,
  confirmText,
  cancelText,
  onConfirm,
  onDismiss,
  useInput,
  ...props
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(defaultValue ?? "");
  const modalTitle = useMemo(() => {
    if (title) return t(title);
    if (useInput) return t("Warning");
    return t("Confirm");
  }, [t, title, useInput]);
  const handleOk = () => {
    if (!useInput) {
      const confirm = onConfirm as (value: boolean) => void;
      confirm(true);
    } else {
      const confirm = onConfirm as (value: string) => void;
      confirm(value);
      setValue(defaultValue ?? "");
    }
    onDismiss?.();
  };
  const handleCancel = () => {
    if (!useInput) {
      const confirm = onConfirm as (value: boolean) => void;
      confirm(false);
    } else {
      setValue(defaultValue ?? "");
    }
    onDismiss?.();
  };

  return (
    <StyledModalV2 onDismiss={onDismiss} {...props}>
      <Modal title={modalTitle} headerBackground="gradientCardHeader" minHeight="0" hideCloseButton>
        <FlexGap flexDirection="column" gap="20px" mt="auto">
          <Text>{message}</Text>
          {useInput ? (
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
          ) : null}
          <FlexGap gap="12px">
            <Button onClick={handleCancel} ml="auto" variant="secondary">
              {cancelText ?? t("Cancel")}
            </Button>
            <Button onClick={handleOk}>{confirmText ?? t("OK")}</Button>
          </FlexGap>
        </FlexGap>
      </Modal>
    </StyledModalV2>
  );
};

const StyledModalV2 = styled(ModalV2)`
  z-index: ${({ theme }) => theme.zIndices.modal + 1};
`;
