import {
  Box,
  Flex,
  Message,
  Tag,
  LockIcon,
  MessageText,
  useTooltip,
  TooltipText,
  Skeleton,
  Text,
  NextLinkFromReactRouter,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { VaultPosition } from 'utils/cakePool'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import useCakeBenefits from './hooks/useCakeBenefits'

const CakeBenefitsCardWrapper = styled(Box)`
  width: 100%;
  margin-bottom: 24px;
  padding: 1px 1px 3px 1px;
  background: linear-gradient(180deg, #53dee9, #7645d9);
  border-radius: ${({ theme }) => theme.radii.default};
`

const CakeBenefitsCardInner = styled(Box)`
  position: relative;
  z-index: 1;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.default};

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: ${({ theme }) => theme.radii.default};
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

interface CakeBenefitsCardProps {
  onDismiss: () => void
}

const CakeBenefitsCard: React.FC<React.PropsWithChildren<CakeBenefitsCardProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { data: cakeBenefits, status: cakeBenefitsFetchStatus } = useCakeBenefits()
  const { isMobile } = useMatchBreakpoints()

  const {
    targetRef: cakeTargetRef,
    tooltip: cakeTooltip,
    tooltipVisible: cakeTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`%lockedCake% CAKE (including rewards) are locked in the CAKE Pool until %lockedEndTime%`, {
          lockedCake: cakeBenefits?.lockedCake,
          lockedEndTime: cakeBenefits?.lockedEndTime,
        })}
      </Text>
      <NextLinkFromReactRouter to="/pools" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  const {
    targetRef: iCakeTargetRef,
    tooltip: iCakeTooltip,
    tooltipVisible: iCakeTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`iCAKE allows you to participate in the IFO public sales and commit up to %iCake% amount of CAKE.`, {
          iCake: cakeBenefits?.iCake,
        })}
      </Text>
      <NextLinkFromReactRouter to="/ifo" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  const {
    targetRef: bCakeTargetRef,
    tooltip: bCakeTooltip,
    tooltipVisible: bCakeTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t(`bCAKE allows you to boost your yield in PancakeSwap Farms by up to 2x.`)}</Text>
      <NextLinkFromReactRouter to="/farms" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  const {
    targetRef: vCakeTargetRef,
    tooltip: vCakeTooltip,
    tooltipVisible: vCakeTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`vCAKE boosts your voting power to %totalScore% in the PancakeSwap voting governance.`, {
          totalScore: cakeBenefits?.vCake?.totalScore,
        })}
      </Text>
      <NextLinkFromReactRouter to="/voting" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  return cakeBenefitsFetchStatus === FetchStatus.Fetched ? (
    <>
      {[VaultPosition.None, VaultPosition.Flexible].includes(cakeBenefits?.lockPosition) ? (
        <>
          <Flex flexDirection="row" alignItems="center">
            <Tag variant="secondary" mr="auto">
              <Flex alignItems="center">
                <Box as={LockIcon} mr="4px" />
                {t('No CAKE locked')}
              </Flex>
            </Tag>
            <Text fontSize="16px">{cakeBenefits?.lockedCake}</Text>
          </Flex>
          <Message mt="8px" mb="16px" variant="warning">
            <MessageText maxWidth="200px">
              {t(
                'Lock CAKE to enjoy the benefits of farm yield boosting, participating in IFOs, voting power boosts, and so much more!',
              )}{' '}
              <NextLinkFromReactRouter
                style={{ textDecoration: 'underline', fontWeight: 'bold' }}
                to="/pools"
                onClick={onDismiss}
              >
                {t('Go to Pools')}
              </NextLinkFromReactRouter>
            </MessageText>
          </Message>
        </>
      ) : [VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(cakeBenefits?.lockPosition) ? (
        <>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Tag variant="failure" mr="auto">
              <Flex alignItems="center">
                <Box as={LockIcon} mr="4px" />
                {t('CAKE staking expired')}
              </Flex>
            </Tag>
            <Text fontSize="16px">{cakeBenefits?.lockedCake}</Text>
          </Flex>
          <Message mt="8px" mb="16px" variant="warning">
            <MessageText maxWidth="200px">
              {t(
                'Renew your staking position to continue enjoying the benefits of farm yield boosting, participating in IFOs, voting power boosts, and so much more!',
              )}{' '}
              <NextLinkFromReactRouter
                style={{ textDecoration: 'underline', fontWeight: 'bold' }}
                to="/pools"
                onClick={onDismiss}
              >
                {t('Go to Pools')}
              </NextLinkFromReactRouter>
            </MessageText>
          </Message>
        </>
      ) : (
        <CakeBenefitsCardWrapper>
          <CakeBenefitsCardInner>
            <Flex flexDirection="row" alignItems="center">
              <Tag variant="secondary" mr="auto">
                <Flex alignItems="center">
                  <Box as={LockIcon} mr="4px" />
                  {t('CAKE locked')}
                </Flex>
              </Tag>
              <TooltipText ref={cakeTargetRef} bold fontSize="16px">
                {cakeBenefits?.lockedCake}
              </TooltipText>
              {cakeTooltipVisible && cakeTooltip}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={iCakeTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                iCAKE
              </TooltipText>
              {iCakeTooltipVisible && iCakeTooltip}
              {cakeBenefits?.iCake}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={bCakeTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                bCAKE
              </TooltipText>
              {bCakeTooltipVisible && bCakeTooltip}
              {t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={vCakeTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                vCAKE
              </TooltipText>
              {vCakeTooltipVisible && vCakeTooltip}
              {cakeBenefits?.vCake?.vaultScore}
            </Flex>
          </CakeBenefitsCardInner>
        </CakeBenefitsCardWrapper>
      )}
    </>
  ) : (
    <Skeleton width="100%" height={146} borderRadius="16px" marginBottom={24} />
  )
}

export default CakeBenefitsCard
