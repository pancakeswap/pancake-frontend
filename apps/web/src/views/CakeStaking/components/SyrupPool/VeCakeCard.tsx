import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { memo } from 'react'
import { styled } from 'styled-components'
import { BENEFITS } from '../BenefitCard'
import { StyledBox } from '../MyVeCakeCard'
import { VeCakeButton } from './VeCakeButton'

const StyledFlex = styled(Flex)`
  gap: 4px;
  align-items: center;
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

export const VeCakeCard = memo(() => {
  const { t } = useTranslation()
  return (
    <Flex flexDirection="column" style={{ gap: 10 }}>
      <StyledBox p="10px" style={{ alignItems: 'center', gap: 10 }}>
        <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="38px" />
        <Text color="white" bold fontSize={14}>
          {t('Stake & Lock for veCAKE, to enjoy more rewards & benefit!')}
        </Text>
      </StyledBox>
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
