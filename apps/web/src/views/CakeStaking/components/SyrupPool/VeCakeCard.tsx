import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { formatBigInt, formatNumber } from '@pancakeswap/utils/formatBalance'
import { LightGreyCard } from 'components/Card'
import { useCakeDistributed } from 'hooks/useCakeDistributed'
import useTheme from 'hooks/useTheme'
import { memo } from 'react'
import { keyframes, styled } from 'styled-components'
import { useGaugesVotingCount } from '../../hooks/useGaugesVotingCount'
import { BENEFITS } from '../BenefitCard'
import { StyledBox } from '../MyVeCakeCard'
import { VeCakeButton } from './VeCakeButton'

const shineAnimation = keyframes`
	0% {transform:translateX(-100%);}
  7% {transform:translateX(100%);}
	100% {transform:translateX(100%);}
`

export const ShineStyledBox = styled(StyledBox)`
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    top: 0;
    transform: translateX(100%);
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    animation: ${shineAnimation} 15s infinite 2s;
    background: -webkit-linear-gradient(
      left,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(128, 186, 232, 0) 99%,
      rgba(125, 185, 232, 0) 100%
    );
  }
`

const StyledFlex = styled(Flex)`
  gap: 4px;
  align-items: center;
`

const StyledTableViewFlex = styled(Flex)`
  align-items: center;
  padding: 8px;
  flex-grow: 0;
  border-bottom: 1px solid #e7e3eb;

  &:last-of-type {
    border-bottom: none;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    border-radius: 16px;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    box-shadow: 0px 2px 0px 0px ${({ theme }) => theme.colors.cardBorder};
    border: 1px solid ${({ theme }) => theme.colors.tertiary};
  }
`

const StyledMiniTableViewFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-left: 10px;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 40%;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-grow: 0;
  }
`

const StyledMiniFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-basis: 50%;
  gap: 10px;
  padding-left: 10px;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
  height: 1px;
  margin: 8px 0;
`
const VerticalDivider = styled.div`
  opacity: 0.5;
  background: #e7e3eb;
  height: 45px;
  width: 1px;

  ${({ theme }) => theme.mediaQueries.sm} {
    opacity: 1;
    background-color: ${({ theme }) => theme.colors.cardBorder};
  }
`

const ImageBox = styled.div`
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const VeCakeBenefitCard: React.FC<{ isTableView?: boolean }> = memo(({ isTableView }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <ShineStyledBox
      p="10px"
      style={{
        alignItems: 'center',
        gap: 10,
        height: isTableView ? '56px' : undefined,
        display: isTableView ? 'inline-flex' : 'flex',
        width: isTableView ? 'fit-content' : '100%',
      }}
    >
      <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="38px" />
      <Text color="white" bold fontSize={isMobile && isTableView ? 11 : 14}>
        {t('Stake & Lock for veCAKE, to enjoy more rewards & benefit!')}
      </Text>
    </ShineStyledBox>
  )
})

export const VeCakeCard = memo(() => {
  const { t } = useTranslation()
  const gaugesVotingCount = useGaugesVotingCount()
  const totalCakeDistributed = useCakeDistributed()
  return (
    <Flex flexDirection="column" style={{ gap: 10 }}>
      <VeCakeBenefitCard />
      <Text bold>{t('Explore veCAKE Benefits')}:</Text>
      <LightGreyCard style={{ padding: '8px 12px', marginBottom: 10 }}>
        <StyledFlex>
          <ImageBox>
            <img src={BENEFITS.earnCake.headImg} alt="earn-cake" width="38px" />
          </ImageBox>
          <Box>
            <Text color="body" bold>
              {BENEFITS.earnCake.title}
            </Text>
            <Flex style={{ gap: 5 }}>
              <Text fontSize={14} color="text">
                {BENEFITS?.earnCake?.subTitle}
              </Text>
              <Text fontSize={14} color="text" bold>
                {`${formatNumber(Number(formatBigInt(totalCakeDistributed)))} CAKE`}
              </Text>
            </Flex>
          </Box>
        </StyledFlex>
        <Divider />
        <StyledFlex>
          <ImageBox>
            <img src={BENEFITS.gaugesVoting.headImg} alt="earn-cake" width="48px" />
          </ImageBox>
          <Box>
            <Text color="body" bold>
              {BENEFITS.gaugesVoting.title}
            </Text>
            <Flex style={{ gap: 5 }}>
              <Text fontSize={14} color="text">
                {BENEFITS?.gaugesVoting?.subTitle}
              </Text>
              <Text fontSize={14} color="text" bold>
                {gaugesVotingCount?.toString() ?? 0}
              </Text>
            </Flex>
          </Box>
        </StyledFlex>
        <Divider />
        <StyledFlex>
          <ImageBox>
            <img src={BENEFITS.farmBoost.headImg} alt="earn-cake" width="38px" />
          </ImageBox>
          <Box>
            <Text color="body" bold>
              {BENEFITS.farmBoost.title}
            </Text>
            <Flex style={{ gap: 5 }}>
              <Text fontSize={14} color="text">
                {BENEFITS?.farmBoost?.subTitle}
              </Text>
              <Text fontSize={14} color="text" bold>
                2.5X
              </Text>
            </Flex>
          </Box>
        </StyledFlex>
        <Divider />
        <StyledFlex alignItems="center" justifyContent="center">
          <StyledMiniFlex justifyContent="flex-end">
            <ImageBox>
              <img src={BENEFITS.snapshotVoting.headImg} alt="earn-cake" width="38px" />
            </ImageBox>
            <Box>
              <Text color="body" bold lineHeight="16px">
                {BENEFITS.snapshotVoting.title}
              </Text>
            </Box>
          </StyledMiniFlex>
          <VerticalDivider />
          <StyledMiniFlex>
            <ImageBox>
              <img src={BENEFITS.ifo.headImg} alt="earn-cake" width="38px" />
            </ImageBox>
            <Box>
              <Text color="body" lineHeight="16px" bold>
                {t('IFO and more')}
              </Text>
            </Box>
          </StyledMiniFlex>
        </StyledFlex>
      </LightGreyCard>
      <VeCakeButton type="get" />
    </Flex>
  )
})

export const VeCakeCardTableView = memo(() => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()
  const gaugesVotingCount = useGaugesVotingCount()
  const totalCakeDistributed = useCakeDistributed()
  return (
    <LightGreyCard
      style={{
        padding: isMobile ? 0 : '16px',
        gap: isMobile ? 12 : 8,
        display: 'flex',
        maxWidth: isMobile ? '100%' : '60%',
        flexGrow: 0,
        flexWrap: 'wrap',
        border: isMobile ? 'none' : `2px solid ${theme.colors.input}`,
        marginBottom: isMobile ? 14 : undefined,
      }}
    >
      <StyledTableViewFlex flexBasis={isMobile ? '100%' : 'calc(50% - 4px)'}>
        <ImageBox>
          <img src={BENEFITS.earnCake.headImg} alt="earn-cake" width="38px" />
        </ImageBox>
        <Box>
          <Text color="secondary" bold>
            {BENEFITS.earnCake.title}
          </Text>
          <Text fontSize={14} color="text">
            {BENEFITS?.earnCake?.subTitle}
            <Text fontSize={14} color="text" ml="3px" bold display="inline-block">
              {`${formatNumber(Number(formatBigInt(totalCakeDistributed)))} CAKE`}
            </Text>
          </Text>
        </Box>
      </StyledTableViewFlex>
      <StyledTableViewFlex flexBasis={isMobile ? '100%' : 'calc(50% - 4px)'}>
        <ImageBox>
          <img src={BENEFITS.gaugesVoting.headImg} alt="earn-cake" width="48px" />
        </ImageBox>
        <Box>
          <Text color="secondary" bold>
            {BENEFITS.gaugesVoting.title}
          </Text>
          <Text fontSize={14} color="text">
            {BENEFITS?.gaugesVoting?.subTitle}
            <Text fontSize={14} color="text" ml="3px" bold display="inline-block">
              {gaugesVotingCount?.toString() ?? 0}
            </Text>
          </Text>
        </Box>
      </StyledTableViewFlex>
      <StyledTableViewFlex flexBasis={isMobile ? '100%' : 'calc(40% - 4px)'}>
        <ImageBox>
          <img src={BENEFITS.farmBoost.headImg} alt="earn-cake" width="38px" />
        </ImageBox>
        <Box>
          <Text color="secondary" bold>
            {BENEFITS.farmBoost.title}
          </Text>
          <Text fontSize={14} color="text">
            {BENEFITS?.farmBoost?.subTitle}
            <Text fontSize={14} color="text" ml="3px" bold display="inline-block">
              2.5X
            </Text>
          </Text>
        </Box>
      </StyledTableViewFlex>
      <StyledTableViewFlex
        alignItems="center"
        justifyContent="center"
        flexBasis={isMobile ? '100%' : 'calc(60% - 4px)'}
      >
        <StyledMiniTableViewFlex justifyContent="flex-end">
          <ImageBox>
            <img src={BENEFITS.snapshotVoting.headImg} alt="earn-cake" width="38px" />
          </ImageBox>
          <Box>
            <Text color="secondary" bold lineHeight="16px">
              {BENEFITS.snapshotVoting.title}
            </Text>
          </Box>
        </StyledMiniTableViewFlex>
        <VerticalDivider />
        <StyledMiniTableViewFlex>
          <ImageBox>
            <img src={BENEFITS.ifo.headImg} alt="earn-cake" width="38px" />
          </ImageBox>
          <Box>
            <Text color="secondary" lineHeight="16px" bold>
              {t('IFO and more')}
            </Text>
          </Box>
        </StyledMiniTableViewFlex>
      </StyledTableViewFlex>
    </LightGreyCard>
  )
})
