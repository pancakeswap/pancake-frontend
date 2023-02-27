import { Flex } from "../../components/Box";
import { Skeleton } from "../../components/Skeleton";

export const IfoSkeletonCardActions = () => {
  return <Skeleton height="48px" />;
};

export const IfoSkeletonCardTokens = () => {
  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Skeleton variant="circle" width="32px" height="32px" mr="16px" />
        <Skeleton width="90%" />
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Skeleton variant="circle" width="32px" height="32px" mr="16px" />
        <Skeleton width="90%" />
      </Flex>
    </div>
  );
};

export const IfoSkeletonCardDetails = () => {
  return (
    <div>
      <Skeleton mb="8px" />
      <Skeleton />
    </div>
  );
};

export default null;
