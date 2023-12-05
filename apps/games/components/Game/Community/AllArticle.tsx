import { styled } from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import { Box, Text, Flex, PaginationButton, SearchInput, InputGroup, SearchIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { Categories, getLanguageCodeFromLS, LS_KEY } from '@pancakeswap/blog'
import { CardArticle } from 'components/Game/Community/CardArticle'
import { CategoriesSelector } from 'components/Game/Community/CategoriesSelector'
import { SkeletonArticle } from 'components/Game/Community/SkeletonArticle'
import { ArticleSortSelect } from 'components/Game/Community/ArticleSortSelect'
import { useAllGamesArticle } from 'hooks/useAllGamesArticle'
import { useLanguage } from 'hooks/useLanguage'
import { useGameCategories } from 'hooks/useGameCategories'

const StyledArticleContainer = styled(Box)`
  width: 100%;
  margin: 0px auto;
  padding-bottom: 80px;

  @media screen and (min-width: 1440px) {
    width: 1200px;
  }
`

const StyledContainerBackground = styled(Box)`
  background: ${({ theme }) => theme.card.background};
`

const StyledTagContainer = styled(Box)`
  display: none;
  width: 194px;
  min-width: 194px;
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

  ${({ theme }) => theme.mediaQueries.xxl} {
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

export const AllArticle = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const articlesWrapperEl = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGamesCategories, setSelectGamesCategoriesSelected] = useState(0)
  const [sortBy, setSortBy] = useState('createAt:desc')
  const [languageOption, setLanguageOption] = useState('en')
  const languageItems = useLanguage()
  const sortByItems = [
    { label: t('Newest First'), value: 'createAt:desc' },
    { label: t('Oldest First'), value: 'createAt:asc' },
    { label: t('Sort Title A-Z'), value: 'title:asc' },
    { label: t('Sort Title Z-A'), value: 'title:desc' },
  ]
  const gameCategories = useGameCategories({ languageOption })

  useEffect(() => {
    setCurrentPage(1)
  }, [query, selectedGamesCategories, sortBy])

  useEffect(() => {
    if (router.isReady && router.query.category) {
      const searchedTopic: Categories | undefined = gameCategories?.find(
        (category) => category.name.toLowerCase() === (router.query.category as string).toLowerCase(),
      )
      if (searchedTopic) {
        setSelectGamesCategoriesSelected(searchedTopic.id)
        window.scrollTo({
          top: articlesWrapperEl?.current?.offsetTop,
          behavior: 'smooth',
        })
      }
    }
  }, [gameCategories, router.isReady, router.query.category])

  const codeFromStorage = getLanguageCodeFromLS()
  useEffect(() => {
    if (codeFromStorage) {
      setLanguageOption(codeFromStorage)
    }
  }, [codeFromStorage])

  const handleSwitchLanguage = (language: string) => {
    setLanguageOption(language)

    const blogCodeFromStorage = localStorage.getItem(LS_KEY)
    if (blogCodeFromStorage !== language) {
      localStorage.setItem(LS_KEY, language)
    }
  }

  const { articlesData, isFetching } = useAllGamesArticle({
    query,
    sortBy,
    currentPage,
    languageOption,
    selectedGamesCategories,
  })

  const articles = articlesData?.data

  const handlePagination = (value: number) => {
    setCurrentPage(1)
    setCurrentPage(value)
  }

  return (
    <StyledArticleContainer id="all" ref={articlesWrapperEl}>
      <Text
        bold
        pl={['16px']}
        color="secondary"
        mb={['12px', '12px', '12px', '35px']}
        fontSize={['24px', '24px', '24px', '40px']}
      >
        {t('Gaming Announcements')}
      </Text>
      <Flex p={['0', '0', '0', '0', '0', '0', '0 16px']}>
        <StyledTagContainer>
          <CategoriesSelector
            childMargin="0"
            selected={selectedGamesCategories}
            categoriesData={gameCategories ?? []}
            setSelected={setSelectGamesCategoriesSelected}
          />
        </StyledTagContainer>
        <Flex width={['100%', '100%', '100%', '100%', '100%', '100%', '907px']} flexDirection="column">
          <Flex
            mb={['18px', '18px', '18px', '24px']}
            flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
            alignItems={['flexStart', 'flexStart', 'flexStart', 'center']}
            p={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}
          >
            {languageItems.length > 0 && (
              <Flex flexDirection={['column', 'row']} mr={['0', '0', '0', 'auto']}>
                <Box width="100%">
                  <ArticleSortSelect
                    title={t('Languages')}
                    value={languageOption}
                    options={languageItems}
                    setOption={handleSwitchLanguage}
                  />
                </Box>
                <Box width="100%" m={['10px 0 0 0', '0 0 0 16px', '0 0 0 16px', '0 16px']}>
                  <ArticleSortSelect title={t('Sort By')} options={sortByItems} setOption={setSortBy} />
                </Box>
              </Flex>
            )}
            <Box width="100%" m={['0 0 12px 0', '0 0 12px 0', '0 0 12px 0', '22px 0 0 0']}>
              <InputGroup startIcon={<SearchIcon style={{ zIndex: 1 }} color="textSubtle" width="18px" />}>
                <SearchInput placeholder="Search" initialValue={query} onChange={(e) => setQuery(e.target.value)} />
              </InputGroup>
            </Box>
          </Flex>
          <StyledMobileTagContainer>
            <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
              {t('Filter by')}
            </Text>
            <Flex overflowY="auto">
              <CategoriesSelector
                selected={selectedGamesCategories}
                categoriesData={gameCategories ?? []}
                setSelected={setSelectGamesCategoriesSelected}
                childMargin="0 4px 4px 0"
              />
            </Flex>
          </StyledMobileTagContainer>
          {!isFetching && articles.length === 0 ? (
            <Text bold fontSize={20} padding={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}>
              {t('No results found.')}
            </Text>
          ) : (
            <StyledCard>
              {isFetching && articles.length === 0 ? (
                <SkeletonArticle />
              ) : (
                <StyledContainerBackground>
                  <Box>
                    {articles.map((article) => (
                      <CardArticle key={article.id} article={article} />
                    ))}
                  </Box>
                  <PaginationButton
                    showMaxPageText
                    currentPage={articlesData.pagination.page}
                    maxPage={articlesData.pagination.pageCount}
                    setCurrentPage={handlePagination}
                  />
                </StyledContainerBackground>
              )}
            </StyledCard>
          )}
        </Flex>
      </Flex>
    </StyledArticleContainer>
  )
}
