import { ReactElement } from "react";
import { useTranslation } from "@pancakeswap/localization";
import styled from "styled-components";
import { AutoColumn, ErrorIcon, Text, Flex, Button } from "../../components";

const Wrapper = styled.div`
  width: 100%;
`;

export function TransactionErrorContent({
  message,
  onDismiss,
}: {
  message: ReactElement | string;
  onDismiss?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <AutoColumn justify="center">
        <ErrorIcon color="failure" width="64px" />
        <Text color="failure" style={{ textAlign: "center", width: "85%", wordBreak: "break-word" }}>
          {message}
        </Text>
      </AutoColumn>

      {onDismiss ? (
        <Flex justifyContent="center" pt="24px">
          <Button onClick={onDismiss}>{t("Dismiss")}</Button>
        </Flex>
      ) : null}
    </Wrapper>
  );
}
