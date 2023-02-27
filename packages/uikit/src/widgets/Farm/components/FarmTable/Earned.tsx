import styled from "styled-components";
import { Skeleton } from "../../../../components/Skeleton";
import { FarmTableEarnedProps } from "../../types";

interface EarnedPropsWithLoading extends FarmTableEarnedProps {
  userDataReady: boolean;
}

const Amount = styled.span<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`;

const Earned: React.FunctionComponent<React.PropsWithChildren<EarnedPropsWithLoading>> = ({
  earnings,
  userDataReady,
}) => {
  const amount = earnings > 0 ? earnings : 0;

  if (userDataReady) {
    return <Amount earned={amount}>{amount.toLocaleString()}</Amount>;
  }
  return (
    <Amount earned={0}>
      <Skeleton width={60} />
    </Amount>
  );
};

export default Earned;
