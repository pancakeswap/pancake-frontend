import styled from 'styled-components'
import { useState, useMemo } from 'react'
import { Box, Text, Flex, Button, PaginationButton, SearchInput } from '@pancakeswap/uikit'
import CardArticle from 'views/Blog/components/Article/CardArticle'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import ArticleSortSelect from 'views/Blog/components/Article/ArticleSortSelect'

const StyledArticleContainer = styled(Box)`
  width: 100%;
  margin: 45px auto 80px auto;

  ${({ theme }) => theme.mediaQueries.md} {
    margin: 80px auto;
  }

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

const StyledMobileTagContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  margin-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
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

const AllArticle = () => {
  const { t } = useTranslation()
  const { query: urlQuery } = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const [sortBy, setSortBy] = useState('date')
  const [languageOption, setLanguageOption] = useState('all')
  const [_query, setQuery] = useState('')

  const languageItems = [
    { label: t('All'), value: 'all' },
    { label: 'English', value: 'en' },
    { label: '简体中文', value: 'cn' },
    { label: '日本語', value: 'ja' },
    { label: 'Español', value: 'es-ES' },
  ]

  const sortByItems = [
    { label: t('Date'), value: 'date' },
    { label: t('Sort Title A-Z'), value: 'asc' },
    { label: t('Sort Title Z-A'), value: 'desc' },
  ]

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
            mb={['18px', '18px', '18px', '24px']}
            flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
            alignItems={['flexStart', 'flexStart', 'flexStart', 'center']}
            p={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}
          >
            <Flex flexDirection={['column', 'row']}>
              <Box width="100%">
                <ArticleSortSelect title={t('Languages')} options={languageItems} setOption={setLanguageOption} />
              </Box>
              <Box width="100%" m={['10px 0 0 0', '0 0 0 16px', '0 0 0 16px', '0 16px']}>
                <ArticleSortSelect title={t('Sort By')} options={sortByItems} setOption={setSortBy} />
              </Box>
            </Flex>
            <Box width="100%" m={['0 0 12px 0', '0 0 12px 0', '0 0 12px 0', '22px 0 0 0']}>
              <SearchInput initialValue={normalizedUrlSearch} onChange={handleChangeQuery} placeholder="Search" />
            </Box>
          </Flex>
          <StyledMobileTagContainer>
            <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
              {t('Filter by')}
            </Text>
            <Flex overflowY="auto">
              <Button display="block" width="fit-content" scale="sm" variant="subtle" m="0 4px 4px 0">
                All
              </Button>
              <Button display="block" width="fit-content" scale="sm" variant="light" m="0 4px 4px 0">
                Vote
              </Button>
              <Button display="block" width="fit-content" scale="sm" variant="light" m="0 4px 4px 0">
                Vote
              </Button>
              <Button display="block" width="fit-content" scale="sm" variant="light" m="0 4px 4px 0">
                Vote
              </Button>
              <Button display="block" width="fit-content" scale="sm" variant="light" m="0 4px 4px 0">
                Vote
              </Button>
              <Button display="block" width="fit-content" scale="sm" variant="light" m="0 4px 4px 0">
                Vote
              </Button>
              <Button display="block" width="fit-content" scale="sm" variant="light" m="0 4px 4px 0">
                Vote
              </Button>
              <Button display="block" width="fit-content" scale="sm" variant="light" m="0 4px 4px 0">
                Vote
              </Button>
              <Button display="block" width="fit-content" scale="sm" variant="light" m="0 4px 4px 0">
                Vote
              </Button>
              <Button display="block" width="fit-content" scale="sm" variant="light" m="0 4px 4px 0">
                Vote
              </Button>
            </Flex>
          </StyledMobileTagContainer>
          <StyledCard>
            <Box>
              <CardArticle />
              <CardArticle />
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

export default AllArticle
