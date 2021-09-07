import React from 'react'
import { Box, Grid, Text, GridProps, Heading } from '@pancakeswap/uikit'

interface MarketPageTitleProps extends GridProps {
  title: string
  description?: string
}

const MarketPageTitle: React.FC<MarketPageTitleProps> = ({ title, description, children, ...props }) => (
  <Grid gridGap="16px" alignItems="center" gridTemplateColumns={['1fr', null, null, null, 'repeat(2, 1fr)']} {...props}>
    <Box>
      <Heading as="h1" scale="xl" color="secondary" mb="16px">
        {title}
      </Heading>
      {description && <Text color="textSubtle">{description}</Text>}
    </Box>
    <Box>{children}</Box>
  </Grid>
)

export default MarketPageTitle
