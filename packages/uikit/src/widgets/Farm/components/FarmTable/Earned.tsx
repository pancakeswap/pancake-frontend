import { Skeleton } from "../../../../components/Skeleton";
import { FarmTableEarnedProps } from "../../types";
import { Amount } from "../styles";

interface EarnedPropsWithLoading extends FarmTableEarnedProps {
  userDataReady: boolean;
}

const Earned: React.FunctionComponent<React.PropsWithChildren<EarnedPropsWithLoading>> = ({
  earnings,
  userDataReady,
}) => {
  const amount = earnings > 0 ? earnings : 0;

  if (userDataReady) {
    return <Amount amount={amount}>{amount}</Amount>;
  }
  return (
    <Amount amount={0}>
      <Skeleton width={60} />
    </Amount>
  );
};

export default Earned;
