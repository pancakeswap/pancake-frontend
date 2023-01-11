import styled from 'styled-components'
import { useState, useMemo } from 'react'
import { Box, Text, Flex, Button, PaginationButton, SearchInput } from '@pancakeswap/uikit'
import SingleArticle from 'components/Article/SingleArticle'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import ArticleSortSelect from 'components/Article/ArticleSortSelect'

const StyledArticleContainer = styled(Box)`
  width: 100%;
  margin: 80px auto;

  @media screen and (min-width: 1440px) {
    width: 1160px;
  }
`

const StyledTagContainer = styled(Box)`
  display: none;
  width: 194px;
  margin-right: 25px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    display: flex;
    flex-direction: column;
  }
`

const StyledCard = styled(Flex)`
  width: 100%;
  border-radius: 0;
  overflow: hidden;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.xxl} {
    border: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
    border-bottom: ${({ theme }) => `3px solid ${theme.colors.cardBorder}`};
    border-radius: ${({ theme }) => theme.radii.card};
  }
`

const Article = () => {
  const { t } = useTranslation()
  const { query: urlQuery } = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const [sortBy, setSortBy] = useState('date')
  const [_query, setQuery] = useState('')

  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <StyledArticleContainer>
      <Text
        bold
        color="secondary"
        mb={['12px', '12px', '12px', '35px']}
        pl={['16px']}
        fontSize={['24px', '24px', '24px', '40px']}
      >
        {t('All articles')}
      </Text>
      <Flex p={['0', '0', '0', '0', '0', '0', '0 16px']}>
        <StyledTagContainer>
          <Button display="block" width="fit-content" scale="sm" variant="subtle" mb="28px">
            All
          </Button>
          <Button display="block" width="fit-content" scale="sm" variant="light">
            Vote
          </Button>
        </StyledTagContainer>
        <Flex width="100%" flexDirection="column">
          <Flex
            mb="24px"
            flexDirection={['column', 'column', 'column', 'row']}
            alignItems={['flexStart', 'flexStart', 'flexStart', 'center']}
            p={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}
          >
            <ArticleSortSelect setSortBy={setSortBy} />
            <Box width="100%" mt="22px" ml={['0', '0', '0', '16px']}>
              <SearchInput initialValue={normalizedUrlSearch} onChange={handleChangeQuery} placeholder="Search" />
            </Box>
          </Flex>
          <StyledCard>
            <Box>
              <SingleArticle />
              <SingleArticle />
            </Box>
            <PaginationButton
              showMaxPageText
              currentPage={currentPage}
              maxPage={maxPage}
              setCurrentPage={setCurrentPage}
            />
          </StyledCard>
        </Flex>
      </Flex>
    </StyledArticleContainer>
  )
}

export default Article
