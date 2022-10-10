import { ReactNode } from 'react'
import { Box, Grid, GridProps, Heading } from '@pancakeswap/uikit'

interface MarketPageTitleProps extends GridProps {
  title: string
  description?: ReactNode
}

const MarketPageTitle: React.FC<React.PropsWithChildren<MarketPageTitleProps>> = ({
  title,
  description,
  children,
  ...props
}) => (
  <Grid gridGap="16px" alignItems="center" gridTemplateColumns={['1fr', null, null, null, 'repeat(2, 1fr)']} {...props}>
    <Box>
      <Heading as="h1" scale="xl" color="secondary" mb="16px">
        {title}
      </Heading>
      {description}
    </Box>
    <Box>{children}</Box>
  </Grid>
)

export default MarketPageTitle
