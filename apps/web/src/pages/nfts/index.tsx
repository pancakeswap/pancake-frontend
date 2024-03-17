import { Box, Container, Flex, Text } from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import { DEFAULT_COLLECTION_BANNER, DOCKMAN_HOST } from 'config/nfts'
import Link from 'next/link'
import { styled } from 'styled-components'

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
  height: 160px;
  display: flex;
  gap: 25px;
  margin-top: 12px;
`

const CollectionSwiperItem = styled(Link)`
  width: 300px;
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
  display: flex;
  align-items: end;
  cursor: pointer;
  &:hover {
    border: 1px solid #666;
  }
`

const CollectionSwiperItemMeta = styled.div`
  width: 100%;
  padding: 12px;
  border-radius: 0 0 6px 6px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
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
        <div>
          <span style={{ fontSize: 32, fontWeight: 900, fontFamily: 'Poppins' }}> NFT Collection List </span>
          <CollectionSwiper>
            {collections?.map((c) => (
              <CollectionSwiperItem
                href={`/nfts/list/${c?.id}`}
                style={{
                  backgroundImage: `url(${c?.collection_image ?? DEFAULT_COLLECTION_BANNER})`,
                  backgroundSize: '100% 100%',
                }}
                key={c?.id}
              >
                <CollectionSwiperItemMeta>{c?.collection_name}</CollectionSwiperItemMeta>
              </CollectionSwiperItem>
            ))}
            <CollectionSwiperItem
              href="/nfts"
              style={{
                backgroundImage: `url(/images/c2.png)`,
                backgroundSize: '100% 100%',
              }}
            >
              <CollectionSwiperItemMeta>Tesseract Genesis NFT</CollectionSwiperItemMeta>
            </CollectionSwiperItem>

            <CollectionSwiperItem
              href="/nfts"
              style={{
                backgroundImage: `url(/images/c3.png)`,
                backgroundSize: '100% 100%',
              }}
            >
              <CollectionSwiperItemMeta>Upcoming NFTs</CollectionSwiperItemMeta>
            </CollectionSwiperItem>

            <CollectionSwiperItem
              href="/nfts"
              style={{
                backgroundImage: `url(/images/c4.png)`,
                backgroundSize: '100% 100%',
              }}
            >
              <CollectionSwiperItemMeta>Upcoming NFTs</CollectionSwiperItemMeta>
            </CollectionSwiperItem>
          </CollectionSwiper>
        </div>
      </Container>
    </Box>
  )
}
