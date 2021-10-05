import React, { useEffect, useMemo, useState } from 'react'
import { Skeleton, Table, Td, Th, Flex, ArrowUpIcon, ArrowDownIcon } from '@pancakeswap/uikit'
import { useHistory } from 'react-router'
import times from 'lodash/times'
import sum from 'lodash/sum'
import { formatNumber } from 'utils/formatBalance'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { ApiResponseCollectionTokens } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import CollapsibleCard from 'components/CollapsibleCard'
import { useGetLowestPriceFromBunnyId } from '../../hooks/useGetLowestPrice'
import { BNBAmountLabel } from '../../components/CollectibleCard/styles'
import { sortBunniesByRarityBuilder } from './utils'
import { nftsBaseUrl } from '../../constants'
import { SortType } from '../../types'
import { ClickableRow, NftName, StyledSortButton, TableWrapper } from './styles'

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
  const [tokenApiResponse, setTokenApiResponse] = useState<ApiResponseCollectionTokens>(null)
  const [raritySort, setRaritySort] = useState<SortType>('asc')
  const { t } = useTranslation()
  const { push } = useHistory()

  useEffect(() => {
    const fetchTokens = async () => {
      const apiResponse = await getNftsFromCollectionApi(collectionAddress)
      setTokenApiResponse(apiResponse)
    }

    fetchTokens()
  }, [collectionAddress, setTokenApiResponse])

  const totalMinted = tokenApiResponse ? sum(Object.values(tokenApiResponse.attributesDistribution)) : 0

  const sortedBunnieKeys = useMemo(() => {
    if (!tokenApiResponse) return []

    return Object.keys(tokenApiResponse.data).sort(sortBunniesByRarityBuilder({ raritySort, data: tokenApiResponse }))
  }, [raritySort, tokenApiResponse])

  const toggleRaritySort = () => {
    setRaritySort((currentValue) => (currentValue === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <>
      {tokenApiResponse ? (
        <CollapsibleCard title="Bunny Id">
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
                {sortedBunnieKeys.map((bunnyId) => {
                  const nft = tokenApiResponse.data[bunnyId]
                  if (!nft) {
                    // Some bunnies don't exist on testnet
                    return null
                  }
                  const count: number = tokenApiResponse.attributesDistribution[bunnyId] ?? 0
                  const percentage = (count / totalMinted) * 100
                  const handleClick = () => {
                    push(`${nftsBaseUrl}/collections/${collectionAddress}/${bunnyId}`)
                  }

                  return (
                    <ClickableRow key={bunnyId} onClick={handleClick} title={t('Click to view NFT')}>
                      <Td>
                        <NftName thumbnailSrc={nft.image.thumbnail} name={nft.name} />
                      </Td>
                      <Td textAlign="center">{formatNumber(count, 0, 0)}</Td>
                      <Td textAlign="center">{`${formatNumber(percentage, 0, 2)}%`}</Td>
                      <Td textAlign="right" width="100px">
                        <LowestPriceCell bunnyId={bunnyId} />
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
