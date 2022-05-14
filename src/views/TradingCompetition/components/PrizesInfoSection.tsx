import { ReactNode } from 'react'
import { Box } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import PageSection from 'components/PageSection'
import RibbonWithImage from './RibbonWithImage'
import { useTranslation } from '../../../contexts/Localization'
import { LIGHTBLUEBG_DARK, LIGHTBLUEBG } from '../pageSectionStyles'
import FanTokenPrizesInfo from '../fantoken/components/PrizesInfo/FanTokenPrizesInfo'
import PrizesIcon from '../svgs/PrizesIcon'

interface PrizesInfoSectionProps {
  prizesInfoComponent: ReactNode
}

const PrizesInfoSection: React.FC<PrizesInfoSectionProps> = ({ prizesInfoComponent }) => {
  const { isDark } = useTheme()
  const { t } = useTranslation()

  return (
    <>
      <PageSection
        containerProps={{ style: { marginTop: '-30px' } }}
        dividerComponent={
          <RibbonWithImage imageComponent={<PrizesIcon width="175px" />} ribbonDirection="up">
            {t('Prizes')}
          </RibbonWithImage>
        }
        concaveDivider
        clipFill={{
          light: 'linear-gradient(139.73deg, #e5fcfe 0%, #ecf6ff 100%)',
          dark: 'linear-gradient(139.73deg, #303d5b 0%, #363457 100%)',
        }}
        dividerPosition="top"
        background={isDark ? LIGHTBLUEBG_DARK : LIGHTBLUEBG}
        index={4}
      >
        <Box my="64px">
          {prizesInfoComponent}
          <FanTokenPrizesInfo />
        </Box>
      </PageSection>
    </>
  )
}

export default PrizesInfoSection
