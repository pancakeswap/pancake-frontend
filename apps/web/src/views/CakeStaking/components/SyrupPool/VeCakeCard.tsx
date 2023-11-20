import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import useTheme from 'hooks/useTheme'
import { memo } from 'react'
import { styled } from 'styled-components'
import { BENEFITS } from '../BenefitCard'
import { StyledBox } from '../MyVeCakeCard'
import { VeCakeButton } from './VeCakeButton'

const StyledFlex = styled(Flex)`
  gap: 4px;
  align-items: center;
`

const StyledTableViewFlex = styled(Flex)`
  align-items: center;
  background-color: white;
  border-radius: 16px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  box-shadow: 0px 2px 0px 0px ${({ theme }) => theme.colors.cardBorder};
  flex-grow: 0;
`

const StyledMiniTableViewFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-basis: 50%;
  gap: 10px;
  padding-left: 10px;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 40%;
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
  background-color: ${({ theme }) => theme.colors.cardBorder};
  height: 45px;
  width: 1px;
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
  return (
    <StyledBox
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
      <Text color="white" bold fontSize={14}>
        {t('Stake & Lock for veCAKE, to enjoy more rewards & benefit!')}
      </Text>
    </StyledBox>
  )
})

export const VeCakeCard = memo(() => {
  const { t } = useTranslation()
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
              {t(BENEFITS.earnCake.title)}
            </Text>
            <Text fontSize={14} color="text">
              {t(BENEFITS?.earnCake?.subTitle ?? '')}
            </Text>
          </Box>
        </StyledFlex>
        <Divider />
        <StyledFlex>
          <ImageBox>
            <img src={BENEFITS.gaugesVoting.headImg} alt="earn-cake" width="48px" />
          </ImageBox>
          <Box>
            <Text color="body" bold>
              {t(BENEFITS.gaugesVoting.title)}
            </Text>
            <Text fontSize={14} color="text">
              {t(BENEFITS?.gaugesVoting?.subTitle ?? '')}
            </Text>
          </Box>
        </StyledFlex>
        <Divider />
        <StyledFlex>
          <ImageBox>
            <img src={BENEFITS.farmBoost.headImg} alt="earn-cake" width="38px" />
          </ImageBox>
          <Box>
            <Text color="body" bold>
              {t(BENEFITS.farmBoost.title)}
            </Text>
            <Text fontSize={14} color="text">
              {t(BENEFITS?.farmBoost?.subTitle ?? '')}
            </Text>
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
                {t(BENEFITS.snapshotVoting.title)}
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
  return (
    <LightGreyCard
      style={{
        padding: '16px',
        gap: 8,
        display: 'flex',
        maxWidth: '60%',
        flexGrow: 0,
        flexWrap: 'wrap',
        border: `2px solid ${theme.colors.input}`,
      }}
    >
      <StyledTableViewFlex flexBasis="calc(50% - 4px)">
        <ImageBox>
          <img src={BENEFITS.earnCake.headImg} alt="earn-cake" width="38px" />
        </ImageBox>
        <Box>
          <Text color="secondary" bold>
            {t(BENEFITS.earnCake.title)}
          </Text>
          <Text fontSize={14} color="text">
            {t(BENEFITS?.earnCake?.subTitle ?? '')}
          </Text>
        </Box>
      </StyledTableViewFlex>
      <StyledTableViewFlex flexBasis="calc(50% - 4px)">
        <ImageBox>
          <img src={BENEFITS.gaugesVoting.headImg} alt="earn-cake" width="48px" />
        </ImageBox>
        <Box>
          <Text color="secondary" bold>
            {t(BENEFITS.gaugesVoting.title)}
          </Text>
          <Text fontSize={14} color="text">
            {t(BENEFITS?.gaugesVoting?.subTitle ?? '')}
          </Text>
        </Box>
      </StyledTableViewFlex>
      <StyledTableViewFlex flexBasis="calc(40% - 4px)">
        <ImageBox>
          <img src={BENEFITS.farmBoost.headImg} alt="earn-cake" width="38px" />
        </ImageBox>
        <Box>
          <Text color="secondary" bold>
            {t(BENEFITS.farmBoost.title)}
          </Text>
          <Text fontSize={14} color="text">
            {t(BENEFITS?.farmBoost?.subTitle ?? '')}
          </Text>
        </Box>
      </StyledTableViewFlex>
      <StyledTableViewFlex alignItems="center" justifyContent="center" flexBasis="calc(60% - 4px)">
        <StyledMiniTableViewFlex justifyContent="flex-end">
          <ImageBox>
            <img src={BENEFITS.snapshotVoting.headImg} alt="earn-cake" width="38px" />
          </ImageBox>
          <Box>
            <Text color="secondary" bold lineHeight="16px">
              {t(BENEFITS.snapshotVoting.title)}
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
