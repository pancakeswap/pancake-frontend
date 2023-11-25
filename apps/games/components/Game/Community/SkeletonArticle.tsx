import { Flex, Skeleton } from '@pancakeswap/uikit'

export const SkeletonArticle = () => {
  return (
    <Flex flexDirection="column" padding={['24px 16px', '24px 16px', '24px 16px', '24px 16px', '24px 32px']}>
      {[1, 2, 3].map((loopNumber) => (
        <Flex padding="16px 0" key={loopNumber}>
          <Skeleton
            borderRadius={8}
            mr={['8px', '15px', '20px', '58px']}
            width={['132px', '152px', '192px', '320px']}
            height={['71px', '91px', '111px', '180px']}
          />
          <Flex width="100%" flexDirection="column">
            <Skeleton width={80} height={18} mb="24px" />
            <Skeleton width={280} height={24} mb={['8px', '8px', '8px', '24px']} />
            <Skeleton width="100%" height={50} display={['none', null, null, 'block']} mb="24px" />
            <Skeleton width={80} height={18} ml="auto" />
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
