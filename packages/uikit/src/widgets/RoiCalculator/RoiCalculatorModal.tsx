import { useTranslation } from "@pancakeswap/localization";
import styled from "styled-components";

import { RoiCalculatorProps, RoiCalculator } from "./RoiCalculator";
import { Modal } from "../Modal";

export const StyledModal = styled(Modal)`
  & > :nth-child(2) {
    padding: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 400px;
  }
`;

interface Props extends RoiCalculatorProps {
  onBack?: () => void;
  onDismiss?: () => void;
}

export function RoiCalculatorModal({ onBack, onDismiss, ...rest }: Props) {
  const { t } = useTranslation();

  return (
    <StyledModal
      title={t("ROI Calculator")}
      onDismiss={onBack || onDismiss}
      onBack={onBack}
      headerBackground="gradientCardHeader"
    >
      <RoiCalculator {...rest} />
    </StyledModal>
  );
}
