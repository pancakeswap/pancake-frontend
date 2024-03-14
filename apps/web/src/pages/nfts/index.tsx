import { useQuery } from '@tanstack/react-query'
import { styled } from 'styled-components'
import { Box, Container, Flex, Text } from '@pancakeswap/uikit'
import Link from 'next/link'
import { DOCKMAN_HOST } from 'config/nfts'

const CollectionCard = styled(Flex)`
  border-radius: 8px;
  //border: 1px solid #3a3a3a;
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px #000;
  border: 1px solid #383838;

  position: relative;

  img {
    border-radius: 12px;
  }
`

const CollectionCardContent = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 50px;
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
          <img src="/images/tesseract-banner.gif" alt="tesseract" width="100%" />
          <CollectionCardContent>
            <Text fontSize="30px">Trade more & Earn more</Text>
            <Text fontSize="20px" fontWeight={300} color="textSubtle" mt="20px">
              Join early
            </Text>
            <Text fontSize="20px" fontWeight={300} color="textSubtle">
              Shape the Tesseract Genesis NFT launch
            </Text>
            <Text fontSize="20px" fontWeight={300} color="textSubtle">
              Unlock potential rewards!
            </Text>
            <Box
              mt="20px"
              borderRadius="8px"
              background="#383838"
              width="160px"
              display="flex"
              height="40px"
              color="#898989"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              COMING SOON...
            </Box>
          </CollectionCardContent>
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
