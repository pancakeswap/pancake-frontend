import React from 'react'
import { Heading, Text, Flex, ChevronRightIcon } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { useGetCollectibles } from 'state/hooks'
import styled from 'styled-components'
import CollectibleCard from './CollectibleCard'

const CollectibleList = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  padding: 16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 24px;
    grid-template-columns: repeat(3, 1fr);
    padding: 24px 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(4, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(5, 1fr);
  }
`

const Collectibles = () => {
  const { t } = useTranslation()
  const { nftsInWallet } = useGetCollectibles()

  return (
    <>
      <Heading as="h4" scale="md" mb="8px">
        {t('Pancake Collectibles')}
      </Heading>
      <Text as="p">
        {t('Pancake Collectibles are special ERC-721 NFTs that can be used on the PancakeSwap platform.')}
      </Text>
      <Text as="p">
        {t("NFTs in this user's wallet that aren't approved Pancake Collectibles won't be shown here.")}
      </Text>
      {nftsInWallet.length > 0 && (
        <CollectibleList>
          {nftsInWallet.map((nftInWallet) => (
            <CollectibleCard key={nftInWallet.identifier} nft={nftInWallet} />
          ))}
        </CollectibleList>
      )}
      {nftsInWallet.length === 0 && (
        <Flex justifyContent="center" p="32px">
          <Text fontSize="20px" bold color="textDisabled">
            {t('No NFTs Found')}
          </Text>
        </Flex>
      )}
      <Flex alignItems="center" justifyContent="flex-end">
        <Link to="/collectibles">{t('See all approved Pancake Collectibles')}</Link>
        <ChevronRightIcon />
      </Flex>
    </>
  )
}

export default Collectibles
