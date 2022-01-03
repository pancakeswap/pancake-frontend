import React, { useMemo, useState } from 'react'
import { Skeleton, Table, Td, Th, Flex, ArrowUpIcon, ArrowDownIcon } from '@pancakeswap/uikit'
import times from 'lodash/times'
import { useRouter } from 'next/router'
import { formatNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import CollapsibleCard from 'components/CollapsibleCard'
import { useGetLowestPriceFromBunnyId } from '../../hooks/useGetLowestPrice'
import { BNBAmountLabel } from '../../components/CollectibleCard/styles'
import { nftsBaseUrl } from '../../constants'
import { SortType } from '../../types'
import { ClickableRow, NftName, StyledSortButton, TableWrapper } from './styles'
import { useGetCollectionDistributionPB } from '../../hooks/useGetCollectionDistribution'

interface PancakeBunniesTraitsProps {
  collectionAddress: string
}

const LowestPriceCell: React.FC<{ bunnyId: string }> = ({ bunnyId }) => {
  const { isFetching, lowestPrice } = useGetLowestPriceFromBunnyId(bunnyId)

  if (isFetching) {
    return (
      <Flex justifyContent="flex-end" width="100px">
        <Skeleton height="24px" width="48px" />
      </Flex>
    )
  }

  if (!lowestPrice) {
    return null
  }

  return <BNBAmountLabel justifyContent="flex-end" amount={lowestPrice} width="100px" />
}

const PancakeBunniesTraits: React.FC<PancakeBunniesTraitsProps> = ({ collectionAddress }) => {
  const [raritySort, setRaritySort] = useState<SortType>('asc')
  const { t } = useTranslation()
  const {
    data: distributionData,
    total: totalBunnyCount,
    isFetching: isFetchingDistribution,
  } = useGetCollectionDistributionPB()
  const { push } = useRouter()

  const sortedTokenList = useMemo(() => {
    if (!distributionData || !Object.keys(distributionData)) return []

    const distributionKeys: string[] = Object.keys(distributionData)
    const distributionValues: any[] = Object.values(distributionData)

    return distributionValues
      .map((token, index) => ({ ...token, tokenId: distributionKeys[index] }))
      .sort((tokenA, tokenB) => {
        return raritySort === 'asc' ? tokenA.tokenCount - tokenB.tokenCount : tokenB.tokenCount - tokenA.tokenCount
      })
  }, [raritySort, distributionData])

  const toggleRaritySort = () => {
    setRaritySort((currentValue) => (currentValue === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <>
      {!isFetchingDistribution ? (
        <CollapsibleCard title={t('Bunny Id')}>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th textAlign="left">{t('Name')}</Th>
                  <Th>{t('Count')}</Th>
                  <Th>
                    <StyledSortButton type="button" onClick={toggleRaritySort}>
                      <Flex alignItems="center">
                        {t('Rarity')}
                        {raritySort === 'asc' ? <ArrowUpIcon color="secondary" /> : <ArrowDownIcon color="secondary" />}
                      </Flex>
                    </StyledSortButton>
                  </Th>
                  <Th textAlign="right">{t('Lowest')}</Th>
                </tr>
              </thead>
              <tbody>
                {sortedTokenList.map((token) => {
                  const count: number = token.tokenCount
                  const percentage = (count / totalBunnyCount) * 100
                  const handleClick = () => {
                    push(`${nftsBaseUrl}/collections/${collectionAddress}/${token.tokenId}`)
                  }

                  return (
                    <ClickableRow key={token.tokenId} onClick={handleClick} title={t('Click to view NFT')}>
                      <Td>
                        <NftName thumbnailSrc={token.image.thumbnail} name={token.name} />
                      </Td>
                      <Td textAlign="center">{formatNumber(count, 0, 0)}</Td>
                      <Td textAlign="center">{`${formatNumber(percentage, 0, 2)}%`}</Td>
                      <Td textAlign="right" width="100px">
                        <LowestPriceCell bunnyId={token.tokenId} />
                      </Td>
                    </ClickableRow>
                  )
                })}
              </tbody>
            </Table>
          </TableWrapper>
        </CollapsibleCard>
      ) : (
        <CollapsibleCard title={t('Loading...')}>
          <Table>
            <thead>
              <tr>
                <Th textAlign="left">{t('Name')}</Th>
                <Th>{t('Count')}</Th>
                <Th>{t('Rarity')}</Th>
                <Th>{t('Lowest')}</Th>
              </tr>
            </thead>
            <tbody>
              {times(19).map((bunnyCnt) => (
                <tr key={bunnyCnt}>
                  <Td>
                    <Flex alignItems="center">
                      <Skeleton height="48px" width="48px" mr="8px" />
                      <Skeleton width="100px" />
                    </Flex>
                  </Td>
                  <Td>
                    <Skeleton />
                  </Td>
                  <Td>
                    <Skeleton />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CollapsibleCard>
      )}
    </>
  )
}

export default PancakeBunniesTraits
