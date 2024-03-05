import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { GradientBox } from 'views/LandingV4/components/GradientBox'

const Container = styled(Flex)`
  position: relative;
  flex-wrap: wrap;

  > div {
    display: none;
    width: 100%;
    margin-bottom: 24px;
  }

  > div:first-child {
    display: block;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > div {
      width: calc(50% - 12px);
      margin-right: 24px;
    }

    > div:nth-child(2) {
      display: block;
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > div {
      width: calc(33.33% - 16px);
      margin-right: 24px;
    }

    > div:nth-child(2) {
      margin-right: 24px;
    }

    > div:nth-child(3) {
      display: block;
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > div {
      display: block;
      width: calc(25% - 18px);
      margin-right: 24px;
    }

    > div:nth-child(3) {
      margin-right: 24px;
    }

    > div:nth-child(4) {
      margin-right: 0;
    }
  }
`

interface ViewMoreButtonProps {
  onClick?: () => void
}

export const ViewMoreButton: React.FC<ViewMoreButtonProps> = ({ onClick }) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Container>
        <GradientBox />
        <GradientBox />
        <GradientBox />
        <GradientBox />
      </Container>
      <Button variant="secondary" display="block" margin="-24px auto auto auto" onClick={onClick}>
        {t('Load More')}
      </Button>
    </Box>
  )
}
