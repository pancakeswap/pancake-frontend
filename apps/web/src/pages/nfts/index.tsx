import { useQuery } from '@tanstack/react-query'
import { styled } from 'styled-components'
import { AceIcon, AutoRow, Box, Container, Flex, Grid, Text } from '@pancakeswap/uikit'
import Link from 'next/link'
import { DOCKMAN_HOST } from 'config/nfts'
import { displayBalance } from 'utils/display'
import { useEffect } from 'react'

const CollectionCard = styled(Flex)`
  border-radius: 8px;
  //border: 1px solid #3a3a3a;
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px #000;
`

const CollectionSwiper = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }
  overflow-x: scroll;
  height: 180px;
  display: flex;
  gap: 25px;
`

const CollectionSwiperItem = styled(Link)`
  width: 340px;
  flex-grow: 0;
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

  return (
    <Box pb={60}>
      <Container>
        <CollectionCard alignItems="end">
          <img src="/images/tesseract-nft-banner2.png" alt="tesseract" width="100%" />
        </CollectionCard>

        <CollectionSwiper>
          {collections?.map((c) => (
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
    </Box>
  )
}
