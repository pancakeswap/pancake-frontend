import styled from "styled-components";
import { Skeleton } from "../../../../components/Skeleton";
import { FarmTableAmountProps } from "../../types";

interface EarnedPropsWithLoading extends FarmTableAmountProps {
  userDataReady: boolean;
}

const Amount = styled.span<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`;

const LpAmount: React.FunctionComponent<React.PropsWithChildren<EarnedPropsWithLoading>> = ({
  amount,
  userDataReady,
}) => {
  const amountDisplay = amount > 0 ? amount : 0;
  if (userDataReady) {
    return <Amount earned={amountDisplay}>{`${amountDisplay.toLocaleString()} LP`}</Amount>;
  }
  return (
    <Amount earned={0}>
      <Skeleton width={60} />
    </Amount>
  );
};

export default LpAmount;
