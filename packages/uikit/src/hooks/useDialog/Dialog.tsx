import { useTranslation } from "@pancakeswap/localization";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { BoxProps, Flex } from "../../components/Box";
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

  const handleOk = useCallback(() => {
    if (!useInput) {
      const confirm = onConfirm as (value: boolean) => void;
      confirm(true);
    } else {
      const confirm = onConfirm as (value: string) => void;
      confirm(value);
      setValue(defaultValue ?? "");
    }
    onDismiss?.();
  }, [useInput, onConfirm, value, defaultValue, onDismiss]);

  const handleCancel = useCallback(() => {
    if (!useInput) {
      const confirm = onConfirm as (value: boolean) => void;
      confirm(false);
    } else {
      setValue(defaultValue ?? "");
    }
    onDismiss?.();
  }, [useInput, onConfirm, defaultValue, onDismiss]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleOk();
      }
    },
    [handleOk]
  );

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  return (
    <StyledModalV2 onDismiss={onDismiss} {...props}>
      <Modal
        title={modalTitle}
        headerBackground="gradientCardHeader"
        minHeight="0"
        hideCloseButton
        width={["100%", "100%", "100%", "367px"]}
      >
        <FlexGap flexDirection="column" gap="20px" mt="auto">
          <Text>{message}</Text>
          {useInput ? (
            <Input value={value} onKeyDown={onKeyDown} onChange={handleOnChange} placeholder={placeholder} />
          ) : null}
          <Flex>
            <Button onClick={handleCancel} ml="auto" variant="secondary">
              {cancelText ?? t("Cancel")}
            </Button>
            <Button ml="12px" onClick={handleOk}>
              {confirmText ?? t("OK")}
            </Button>
          </Flex>
        </FlexGap>
      </Modal>
    </StyledModalV2>
  );
};

const StyledModalV2 = styled(ModalV2)`
  z-index: ${({ theme }) => theme.zIndices.modal + 1};
`;
