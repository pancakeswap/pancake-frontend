import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import MoreFromThisCollection from 'views/Nft/market/Collection/IndividualNFTPage/shared/MoreFromThisCollection'
import { pancakeBunniesAddress, TMP_SEE_ALL_LINK } from 'views/Nft/market/constants'
import { StyledSquadSamplesContainer, StyledSquadSamplesInnerContainer } from './styles'

const SquadSamplesSection: React.FC = () => {
  const { t } = useTranslation()
  return (
    <StyledSquadSamplesContainer pb="64px" justifyContent="center">
      <StyledSquadSamplesInnerContainer flexDirection="column">
        <MoreFromThisCollection title="" collectionAddress={pancakeBunniesAddress} />
        <Flex justifyContent="center">
          <Box>
            <Link to={TMP_SEE_ALL_LINK}>
              <Button variant="tertiary">{t('View All')}</Button>
            </Link>
          </Box>
        </Flex>
      </StyledSquadSamplesInnerContainer>
    </StyledSquadSamplesContainer>
  )
}

export default SquadSamplesSection
