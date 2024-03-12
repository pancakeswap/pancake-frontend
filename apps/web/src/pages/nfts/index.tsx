import { useQuery } from '@tanstack/react-query'
import { styled } from 'styled-components'
import { AceIcon, AutoRow, Box, Container, Flex, Grid, Text } from '@pancakeswap/uikit'
import Link from 'next/link'
import { DOCKMAN_HOST } from 'config/nfts'
import { displayBalance } from 'utils/display'

const CollectionCard = styled(Flex)`
  aspect-ratio: 2/1;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
  margin-bottom: 25px;
`

const CollectionMeta = styled.div`
  padding: 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
`

const ViewCollection = styled(Link)`
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`

const CollectionSwiper = styled.div`
  overflow-x: scroll;
  height: 180px;
  display: flex;
  gap: 25px;
`

const CollectionSwiperItem = styled(Link)`
  width: 360px;
  flex-grow: 1;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
  padding: 16px;
  display: flex;
  align-items: end;
  cursor: pointer;
  &:hover {
    border: 1px solid #666;
  }
`

export default function Index() {
  const { data } = useQuery({
    queryKey: ['nftCollections'],
    queryFn: () => {
      return fetch(`${DOCKMAN_HOST}/collection?page_number=1&page_size=10&sort_type=time_decrease`, {
        method: 'GET',
      }).then((r) => r.json())
    },
  })

  const collections = data?.data

  const firstCollection = collections?.[0]
  const otherCollections = collections?.slice(1)
  return (
    <Container>
      <CollectionCard style={{ backgroundImage: `url(${firstCollection?.collection_image})` }} alignItems="end">
        <Flex justifyContent="space-between" px="20px" py="20px" width="100%" alignItems="center">
          <CollectionMeta>
            <AutoRow gap="20px">
              <Box>
                <Text color="textSubtle">Floor Price</Text>
                <AutoRow gap="2px">
                  <Text color="text">{displayBalance(firstCollection?.collection_floor_price ?? 0)}</Text>
                  <AceIcon />
                </AutoRow>
              </Box>
              <Box>
                <Text color="textSubtle">1D Volume</Text>
                <AutoRow gap="2px">
                  <Text color="text">{displayBalance(firstCollection?.one_day_volume ?? 0)}</Text>
                  <AceIcon />
                </AutoRow>
              </Box>
            </AutoRow>
          </CollectionMeta>
          <ViewCollection href={`/nfts/list/${firstCollection?.id}`}>View Collection</ViewCollection>
        </Flex>
      </CollectionCard>

      <CollectionSwiper>
        {otherCollections?.map((c) => (
          <CollectionSwiperItem
            href={`/nfts/list/${c?.id}`}
            style={{
              backgroundImage: `url(${c?.collection_image})`,
            }}
            key={c?.id}
          >
            {c?.collection_name}
          </CollectionSwiperItem>
        ))}
      </CollectionSwiper>
    </Container>
  )
}
