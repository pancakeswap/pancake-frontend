import { useState } from 'react'
import times from 'lodash/times'
import capitalize from 'lodash/capitalize'
import sum from 'lodash/sum'
import orderBy from 'lodash/orderBy'
import { ArrowDownIcon, ArrowUpIcon, Flex, Skeleton, Table, Td, Th } from '@pancakeswap/uikit'
import { formatNumber } from 'utils/formatBalance'
import CollapsibleCard from 'components/CollapsibleCard'
import { useTranslation } from 'contexts/Localization'
import { SortType } from '../../types'
import { StyledSortButton, TableWrapper } from './styles'
import useGetCollectionDistribution from '../../hooks/useGetCollectionDistribution'

interface CollectionTraitsProps {
  collectionAddress: string
}

const CollectionTraits: React.FC<CollectionTraitsProps> = ({ collectionAddress }) => {
  const { data, isFetching } = useGetCollectionDistribution(collectionAddress)
  const [raritySort, setRaritySort] = useState<Record<string, SortType>>({})
  const { t } = useTranslation()

  if (isFetching) {
    return (
      <CollapsibleCard title={t('Loading...')}>
        <Table>
          <thead>
            <tr>
              <Th textAlign="left">{t('Name')}</Th>
              <Th width="100px">{t('Count')}</Th>
              <Th width="160px">{t('Rarity')}</Th>
            </tr>
          </thead>
          <tbody>
            {times(19).map((bunnyCnt) => (
              <tr key={bunnyCnt}>
                <Td>
                  <Skeleton width="100px" />
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
    )
  }

  return (
    <>
      {data &&
        Object.keys(data).map((traitType, index) => {
          const total = sum(Object.values(data[traitType]))

          // Parse the distribution values into an array to make it easier to sort
          const traitValues: { value: string; count: number; rarity: number }[] = Object.keys(data[traitType]).reduce(
            (accum, traitValue) => {
              const count = data[traitType][traitValue]
              const rarity = (count / total) * 100

              return [...accum, { value: traitValue, count, rarity }]
            },
            [],
          )
          const sortType = raritySort[traitType] || 'desc'

          const toggleRaritySort = () => {
            setRaritySort((prevRaritySort) => {
              if (!prevRaritySort[traitType]) {
                return {
                  ...prevRaritySort,
                  [traitType]: 'asc',
                }
              }

              return {
                ...prevRaritySort,
                [traitType]: prevRaritySort[traitType] === 'asc' ? 'desc' : 'asc',
              }
            })
          }

          return (
            <CollapsibleCard key={traitType} title={capitalize(traitType)} initialOpenState={index <= 1} mb="32px">
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <Th textAlign="left">{t('Name')}</Th>
                      <Th width="100px">{t('Count')}</Th>
                      <Th width="160px">
                        <StyledSortButton type="button" onClick={toggleRaritySort}>
                          <Flex alignItems="center">
                            {t('Rarity')}
                            {raritySort[traitType] === 'asc' ? (
                              <ArrowUpIcon color="secondary" />
                            ) : (
                              <ArrowDownIcon color="secondary" />
                            )}
                          </Flex>
                        </StyledSortButton>
                      </Th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderBy(traitValues, 'rarity', sortType).map(({ value, count, rarity }) => {
                      return (
                        <tr key={value}>
                          <Td>{capitalize(value)}</Td>
                          <Td textAlign="center">{formatNumber(count, 0, 0)}</Td>
                          <Td textAlign="center">{`${formatNumber(rarity, 0, 2)}%`}</Td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </TableWrapper>
            </CollapsibleCard>
          )
        })}
    </>
  )
}

export default CollectionTraits
