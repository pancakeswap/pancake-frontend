import { Text, Flex, Box, Grid, ArrowBackIcon, ArrowForwardIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'

const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

interface TableNavigationProps {
  currentPage: number
  maxPage: number
  onPagePrev: () => void
  onPageNext: () => void
}

const TableNavigation: React.FC<TableNavigationProps> = ({ currentPage = 1, maxPage = 1, onPagePrev, onPageNext }) => {
  const { t } = useTranslation()

  return (
    <Grid gridGap="16px" gridTemplateColumns={['1fr', null, null, null, '1fr 2fr 1fr']} mt="16px" mb="16px" px="16px">
      <Box />
      <Flex width="100%" justifyContent="center" alignItems="center">
        <Arrow onClick={onPagePrev}>
          <ArrowBackIcon color={currentPage === 1 ? 'textDisabled' : 'primary'} />
        </Arrow>

        <Text>{t('Page %page% of %maxPage%', { page: currentPage, maxPage })}</Text>

        <Arrow onClick={onPageNext}>
          <ArrowForwardIcon color={currentPage === maxPage ? 'textDisabled' : 'primary'} />
        </Arrow>
      </Flex>
      <Flex width="100%" justifyContent="center">
        <SubgraphHealthIndicator subgraphName="gelatodigital/limit-orders-bsc" inline />
      </Flex>
    </Grid>
  )
}

export default TableNavigation
